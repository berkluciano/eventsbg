"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SERVICE_FEE_CENTS } from "@/lib/constants";

const cartItemSchema = z.object({
  ticketTypeId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
});

const checkoutSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5).max(30),
  customerCity: z.string().min(2).max(100),
  customerPostalCode: z.string().regex(/^\d+$/, "Postal code must be numeric").min(3).max(10),
  customerAddress: z.string().min(5).max(200),
  insurance: z.string().optional(),
});

export async function createCheckoutSession(formData: FormData) {
  const rawItems = formData.get("items") as string;
  let cartItems: { ticketTypeId: string; qty: number }[];

  try {
    const parsed = JSON.parse(rawItems);
    cartItems = z.array(cartItemSchema).min(1).parse(parsed);
  } catch {
    return { error: "Invalid cart data. Please refresh and try again." };
  }

  const customerParsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    customerCity: formData.get("customerCity"),
    customerPostalCode: formData.get("customerPostalCode"),
    customerAddress: formData.get("customerAddress"),
    insurance: formData.get("insurance"),
  });

  if (!customerParsed.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const { customerName, customerEmail, customerPhone, customerCity, customerPostalCode, customerAddress, insurance } = customerParsed.data;
  const hasInsurance = insurance === "true";

  const ticketTypeIds = cartItems.map((i) => i.ticketTypeId);
  const ticketTypes = await prisma.ticketType.findMany({
    where: { id: { in: ticketTypeIds } },
    include: { event: { select: { id: true, name: true, venue: true, city: true, published: true } } },
  });

  // Validate all items
  for (const item of cartItems) {
    const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
    if (!tt || !tt.event.published) return { error: `Ticket type not found.` };
    if (tt.capacity !== null) {
      const available = tt.capacity - tt.sold;
      if (item.qty > available) {
        return { error: `Only ${available} ticket(s) remaining for "${tt.name}".` };
      }
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of cartItems) {
    const tt = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: `${tt.event.name} – ${tt.name}`, description: `${tt.event.venue}, ${tt.event.city}` },
        unit_amount: tt.priceCents,
      },
      quantity: item.qty,
    });
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Concierge Service Fee", description: "Per-ticket fee" },
        unit_amount: SERVICE_FEE_CENTS,
      },
      quantity: item.qty,
    });
  }

  if (hasInsurance) {
    const totalTicketCents = cartItems.reduce((sum, item) => {
      const tt = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
      return sum + tt.priceCents * item.qty;
    }, 0);
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Ticket Insurance (5%)" },
        unit_amount: Math.round(totalTicketCents * 0.05),
      },
      quantity: 1,
    });
  }

  // Encode items compactly for metadata: "ttId:qty|ttId:qty"
  const itemsMeta = cartItems.map((i) => `${i.ticketTypeId}:${i.qty}`).join("|");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail,
    metadata: {
      items: itemsMeta,
      customerName,
      customerEmail,
      customerPhone,
      customerCity,
      customerPostalCode,
      customerAddress,
      insurance: hasInsurance ? "true" : "false",
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  redirect(session.url!);
}
