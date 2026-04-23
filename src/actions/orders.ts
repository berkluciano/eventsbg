"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
