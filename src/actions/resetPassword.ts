"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/emails/PasswordReset";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FROM_EMAIL = `Eventor BG <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "noreply@eventor.bg"}>`;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// ── Request reset ─────────────────────────────────────────────────────────────

export async function requestPasswordReset(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = z.string().email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Моля, въведете валиден имейл адрес." };

  // Always return success to avoid email enumeration
  const user = await prisma.user.findUnique({ where: { email: email.data } });
  if (!user) return { success: true };

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({ where: { email: email.data } });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: {
      email: email.data,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const resetUrl = `${SITE_URL}/account/reset-password?token=${token}`;
  const html = await render(
    PasswordResetEmail({ name: user.name, resetUrl })
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email.data,
    subject: "Reset your Eventor BG password",
    html,
  });

  return { success: true };
}

// ── Validate token (used to gate the reset form) ──────────────────────────────

export async function validateResetToken(
  token: string
): Promise<{ valid: boolean; email?: string }> {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) return { valid: false };
  return { valid: true, email: record.email };
}

// ── Apply new password ────────────────────────────────────────────────────────

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function applyPasswordReset(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Невалидни данни." };

  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return { error: "Линкът е изтекъл или невалиден. Моля, заявете нов." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return { success: true };
}
