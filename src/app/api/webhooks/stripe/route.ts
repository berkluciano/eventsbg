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
    const meta = session.metadata ?? {};

    const { items: itemsMeta, customerName, customerEmail, customerPhone, customerCity, customerPostalCode, customerAddress } = meta;

    if (!itemsMeta || !customerName || !customerEmail || !customerPhone) {
      console.error("Missing metadata in Stripe session", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Idempotency: skip if already processed
    const existing = await prisma.order.findFirst({ where: { stripeSessionId: session.id } });
    if (existing) return NextResponse.json({ received: true });

    // Parse items: "ttId:qty|ttId:qty"
    const cartItems = itemsMeta.split("|").map((part) => {
      const [ticketTypeId, qtyStr] = part.split(":");
      return { ticketTypeId, qty: parseInt(qtyStr, 10) };
    });

    const ticketTypeIds = cartItems.map((i) => i.ticketTypeId);
    const ticketTypes = await prisma.ticketType.findMany({
      where: { id: { in: ticketTypeIds } },
      include: { event: true },
    });

    const user = await prisma.user.findUnique({ where: { email: customerEmail } });
    const amountTotal = session.amount_total ?? 0;

    // Create one order per cart item and update sold counts
    const createdOrders = await prisma.$transaction(
      cartItems.map((item) => {
        const tt = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
        return prisma.order.create({
          data: {
            eventId: tt.eventId,
            ticketTypeId: item.ticketTypeId,
            qty: item.qty,
            totalCents: tt.priceCents * item.qty + SERVICE_FEE_CENTS * item.qty,
            serviceFeeCents: SERVICE_FEE_CENTS * item.qty,
            customerName,
            customerEmail,
            customerPhone,
            status: "PENDING_PURCHASE",
            stripeSessionId: session.id,
            userId: user?.id ?? null,
          },
        });
      })
    );

    await prisma.$transaction(
      cartItems.map((item) =>
        prisma.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { sold: { increment: item.qty } },
        })
      )
    );

    // Build email item list
    const emailItems = cartItems.map((item) => {
      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
      return {
        eventName: tt.event.name,
        ticketTypeName: tt.name,
        qty: item.qty,
        priceCents: tt.priceCents,
        serviceFeeCents: SERVICE_FEE_CENTS * item.qty,
        eventDate: formatDateTime(tt.event.startsAt),
        eventVenue: tt.event.venue,
        eventCity: tt.event.city,
      };
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg";
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eventor.bg";
    const primaryOrderId = createdOrders[0]?.id ?? session.id;

    await Promise.allSettled([
      resend.emails.send({
        from: `Eventor BG <${supportEmail}>`,
        to: customerEmail,
        subject: `Order Confirmed – ${emailItems.map((i) => i.eventName).join(", ")}`,
        react: OrderConfirmation({
          customerName,
          items: emailItems,
          totalCents: amountTotal,
          orderId: primaryOrderId,
        }),
      }),
      resend.emails.send({
        from: `Eventor BG <${supportEmail}>`,
        to: adminEmail,
        subject: `NEW ORDER #${primaryOrderId.slice(-8).toUpperCase()} – ${emailItems.length} item(s)`,
        react: AdminNotification({
          orderId: primaryOrderId,
          customerName,
          customerEmail,
          customerPhone,
          items: emailItems,
          totalCents: amountTotal,
          siteUrl,
        }),
      }),
    ]);
  }

  return NextResponse.json({ received: true });
}
