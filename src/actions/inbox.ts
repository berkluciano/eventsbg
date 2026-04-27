"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markEmailRead(id: string) {
  const email = await prisma.inboundEmail.findUnique({ where: { id } });
  if (!email) return;
  await prisma.inboundEmail.update({
    where: { id },
    data: { read: !email.read },
  });
  revalidatePath("/admin/inbox");
}
