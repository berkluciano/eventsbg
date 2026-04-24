"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SERVICE_FEE_CENTS } from "@/lib/constants";

const checkoutSchema = z.object({
  eventId: z.string().min(1),
  ticketTypeId: z.string().min(1),
  qty: z.coerce.number().int().min(1).max(10),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5).max(30),
  customerCity: z.string().min(2).max(100),
  customerPostalCode: z.string().regex(/^\d+$/, "Postal code must be numeric").min(3).max(10),
  customerAddress: z.string().min(5).max(200),
  insurance: z.string().optional(),
});

export async function createCheckoutSession(formData: FormData) {
  const parsed = checkoutSchema.safeParse({
    eventId: formData.get("eventId"),
    ticketTypeId: formData.get("ticketTypeId"),
    qty: formData.get("qty"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    customerCity: formData.get("customerCity"),
    customerPostalCode: formData.get("customerPostalCode"),
    customerAddress: formData.get("customerAddress"),
    insurance: formData.get("insurance"),
  });

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const { eventId, ticketTypeId, qty, customerName, customerEmail, customerPhone, customerCity, customerPostalCode, customerAddress, insurance } = parsed.data;
  const hasInsurance = insurance === "true";

  const [event, ticketType] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId, published: true } }),
    prisma.ticketType.findUnique({ where: { id: ticketTypeId, eventId } }),
  ]);

  if (!event) return { error: "Event not found." };
  if (!ticketType) return { error: "Ticket type not found." };

  if (ticketType.capacity !== null) {
    const available = ticketType.capacity - ticketType.sold;
    if (qty > available) {
      return { error: `Only ${available} ticket(s) remaining.` };
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const insuranceCents = hasInsurance ? Math.round(ticketType.priceCents * 0.05) : 0;

  const lineItems: Parameters<typeof stripe.checkout.sessions.create>[0]["line_items"] = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `${event.name} – ${ticketType.name}`,
          description: `${event.venue}, ${event.city}`,
        },
        unit_amount: ticketType.priceCents,
      },
      quantity: qty,
    },
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: "Concierge Service Fee",
          description: "Per-ticket fee for our ticket purchasing service",
        },
        unit_amount: SERVICE_FEE_CENTS,
      },
      quantity: qty,
    },
  ];

  if (hasInsurance) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Ticket Insurance",
          description: "Protection in case you can't attend",
        },
        unit_amount: insuranceCents,
      },
      quantity: qty,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail,
    metadata: {
      eventId,
      ticketTypeId,
      qty: String(qty),
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerPostalCode,
      customerAddress,
      insurance: hasInsurance ? "true" : "false",
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/${eventId}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
  });

  redirect(session.url!);
}
