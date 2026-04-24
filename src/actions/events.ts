"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const eventSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  city: z.string().min(2).max(100),
  venue: z.string().min(2).max(200),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  squareImage: z.string().url().optional().or(z.literal("")),
  published: z.coerce.boolean().optional(),
  parentId: z.string().optional().or(z.literal("")),
});

const ticketTypeSchema = z.object({
  name: z.string().min(1).max(100),
  priceCents: z.coerce.number().int().min(1),
  capacity: z.coerce.number().int().min(0).optional().nullable(),
});

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
}

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    city: formData.get("city"),
    venue: formData.get("venue"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    squareImage: formData.get("squareImage") || undefined,
    published: formData.get("published"),
    parentId: formData.get("parentId") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid data: " + parsed.error.issues[0]?.message };
  }

  const { name, description, city, venue, startsAt, endsAt, squareImage, published, parentId } =
    parsed.data;

  let slug = slugify(name);
  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const event = await prisma.event.create({
    data: {
      name,
      slug,
      description,
      city,
      venue,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      squareImage: squareImage || null,
      published: published ?? false,
      parentId: parentId || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEvent(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    city: formData.get("city"),
    venue: formData.get("venue"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    squareImage: formData.get("squareImage") || undefined,
    published: formData.get("published"),
    parentId: formData.get("parentId") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid data: " + parsed.error.issues[0]?.message };
  }

  const { name, description, city, venue, startsAt, endsAt, squareImage, published, parentId } =
    parsed.data;

  await prisma.event.update({
    where: { id },
    data: {
      name,
      description,
      city,
      venue,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
      squareImage: squareImage || null,
      published: published ?? false,
      parentId: parentId || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function toggleEventPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.event.update({ where: { id }, data: { published } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function createTicketType(eventId: string, formData: FormData) {
  await requireAdmin();

  const parsed = ticketTypeSchema.safeParse({
    name: formData.get("name"),
    priceCents: formData.get("priceCents"),
    capacity: formData.get("capacity") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid data: " + parsed.error.issues[0]?.message };
  }

  await prisma.ticketType.create({
    data: { eventId, ...parsed.data },
  });

  revalidatePath(`/admin/events/${eventId}`);
  return { success: true };
}

export async function updateTicketType(id: string, eventId: string, formData: FormData) {
  await requireAdmin();

  const parsed = ticketTypeSchema.safeParse({
    name: formData.get("name"),
    priceCents: formData.get("priceCents"),
    capacity: formData.get("capacity") || undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid data: " + parsed.error.issues[0]?.message };
  }

  await prisma.ticketType.update({ where: { id }, data: parsed.data });
  revalidatePath(`/admin/events/${eventId}`);
  return { success: true };
}

export async function deleteTicketType(id: string, eventId: string) {
  await requireAdmin();
  await prisma.ticketType.delete({ where: { id } });
  revalidatePath(`/admin/events/${eventId}`);
  return { success: true };
}
