"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { RefundNotification } from "@/emails/RefundNotification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg";

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
}

const markPurchasedSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export async function markOrderPurchased(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = markPurchasedSchema.safeParse({
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid data." };
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: "PURCHASED",
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function markOrderFailed(id: string, _formData?: FormData) {
  await requireAdmin();

  await prisma.order.update({
    where: { id },
    data: { status: "FAILED" },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function refundOrder(id: string, _formData?: FormData) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { event: true, ticketType: true },
  });

  if (!order) return { error: "Order not found." };
  if (order.status === "REFUNDED") return { error: "Already refunded." };
  if (!order.stripeSessionId) return { error: "No Stripe session found for this order." };

  // Retrieve the Stripe session to get the payment intent
  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
  if (!session.payment_intent) return { error: "No payment intent found on Stripe session." };

  // Issue full refund
  await stripe.refunds.create({
    payment_intent: session.payment_intent as string,
  });

  // Update order status
  await prisma.order.update({
    where: { id },
    data: { status: "REFUNDED" },
  });

  // Send refund email to customer
  const html = await render(
    RefundNotification({
      customerName: order.customerName,
      eventName: order.event.name,
      ticketTypeName: order.ticketType.name,
      qty: order.qty,
      refundCents: order.totalCents,
      orderId: order.id,
      supportEmail,
    })
  );

  await resend.emails.send({
    from: `Eventor BG <${supportEmail}>`,
    to: order.customerEmail,
    subject: `Refund issued — ${order.event.name}`,
    html,
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function updateOrderNotes(id: string, formData: FormData) {
  await requireAdmin();

  const notes = formData.get("notes") as string;

  await prisma.order.update({
    where: { id },
    data: { notes: notes || null },
  });

  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
