import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { SERVICE_FEE_CENTS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { AdminNotification } from "@/emails/AdminNotification";
import { formatDateTime } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const {
      eventId,
      ticketTypeId,
      qty: qtyStr,
      customerName,
      customerEmail,
      customerPhone,
    } = session.metadata ?? {};

    if (!eventId || !ticketTypeId || !qtyStr || !customerName || !customerEmail || !customerPhone) {
      console.error("Missing metadata in Stripe session", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const qty = parseInt(qtyStr, 10);

    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (existing) {
      return NextResponse.json({ received: true });
    }

    const [dbEvent, ticketType] = await Promise.all([
      prisma.event.findUnique({ where: { id: eventId } }),
      prisma.ticketType.findUnique({ where: { id: ticketTypeId } }),
    ]);

    if (!dbEvent || !ticketType) {
      console.error("Event or ticket type not found for session", session.id);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const amountTotal = session.amount_total ?? 0;
    const serviceFeeCents = SERVICE_FEE_CENTS * qty;

    const user = await prisma.user.findUnique({ where: { email: customerEmail } });

    const order = await prisma.order.create({
      data: {
        eventId,
        ticketTypeId,
        qty,
        totalCents: amountTotal,
        serviceFeeCents,
        customerName,
        customerEmail,
        customerPhone,
        status: "PENDING_PURCHASE",
        stripeSessionId: session.id,
        userId: user?.id ?? null,
      },
    });

    await prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: { sold: { increment: qty } },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const eventDate = formatDateTime(dbEvent.startsAt);
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg";
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eventor.bg";

    await Promise.allSettled([
      resend.emails.send({
        from: `Events BG <${supportEmail}>`,
        to: customerEmail,
        subject: `Order Confirmed – ${dbEvent.name}`,
        react: OrderConfirmation({
          customerName,
          eventName: dbEvent.name,
          ticketTypeName: ticketType.name,
          qty,
          totalCents: amountTotal,
          serviceFeeCents,
          eventDate,
          eventVenue: dbEvent.venue,
          eventCity: dbEvent.city,
          orderId: order.id,
        }),
      }),
      resend.emails.send({
        from: `Events BG <${supportEmail}>`,
        to: adminEmail,
        subject: `NEW ORDER #${order.id.slice(-8).toUpperCase()} – ${dbEvent.name}`,
        react: AdminNotification({
          orderId: order.id,
          customerName,
          customerEmail,
          customerPhone,
          eventName: dbEvent.name,
          ticketTypeName: ticketType.name,
          qty,
          totalCents: amountTotal,
          serviceFeeCents,
          eventDate,
          eventVenue: dbEvent.venue,
          eventCity: dbEvent.city,
          siteUrl,
        }),
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
