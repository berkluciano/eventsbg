"use server";

import { z } from "zod";
import { resend } from "@/lib/resend";

const schema = z.object({
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  businessName: z.string().min(1).max(150),
  businessId: z.string().min(1).max(30),
  socialLink: z.string().url().optional().or(z.literal("")),
  eventName: z.string().min(1).max(200),
  eventLocation: z.string().min(1).max(200),
  eventDate: z.string().min(1),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

export type PartnershipState = { error?: string; success?: boolean };

export async function submitPartnershipApplication(
  _prev: PartnershipState,
  formData: FormData
): Promise<PartnershipState> {
  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    businessName: formData.get("businessName"),
    businessId: formData.get("businessId"),
    socialLink: formData.get("socialLink") || undefined,
    eventName: formData.get("eventName"),
    eventLocation: formData.get("eventLocation"),
    eventDate: formData.get("eventDate"),
    comment: formData.get("comment") || undefined,
  });

  if (!parsed.success) {
    return { error: "Моля попълнете всички задължителни полета правилно." };
  }

  const d = parsed.data;
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eventor.bg";
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@eventor.bg";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#022E66;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;font-size:20px;margin:0">Eventor BG — Нова заявка за партньорство</h1>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none">
        <h2 style="color:#022E66;font-size:16px;margin-top:0">Контактни данни</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse">
          <tr><td style="color:#6b7280;padding:4px 0;width:40%">Имена</td><td><strong>${d.firstName} ${d.lastName}</strong></td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">Имейл</td><td>${d.email}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">Телефон</td><td>${d.phone}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">Фирма</td><td>${d.businessName}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">ЕИК / UIC</td><td>${d.businessId}</td></tr>
          ${d.socialLink ? `<tr><td style="color:#6b7280;padding:4px 0">Социални мрежи</td><td><a href="${d.socialLink}">${d.socialLink}</a></td></tr>` : ""}
        </table>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
        <h2 style="color:#022E66;font-size:16px">Детайли за събитието</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse">
          <tr><td style="color:#6b7280;padding:4px 0;width:40%">Събитие</td><td><strong>${d.eventName}</strong></td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">Място</td><td>${d.eventLocation}</td></tr>
          <tr><td style="color:#6b7280;padding:4px 0">Дата и час</td><td>${d.eventDate}</td></tr>
          ${d.comment ? `<tr><td style="color:#6b7280;padding:4px 0;vertical-align:top">Коментар</td><td>${d.comment}</td></tr>` : ""}
        </table>
      </div>
      <div style="background:#f9fafb;padding:16px 32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:12px;color:#9ca3af;margin:0">Eventor BG — автоматично известие</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `Eventor BG <${supportEmail}>`,
      to: adminEmail,
      replyTo: d.email,
      subject: `Нова заявка за партньорство — ${d.businessName} / ${d.eventName}`,
      html,
    });
  } catch (err) {
    console.error("Partnership email failed:", err);
    return { error: "Грешка при изпращане. Моля опитайте отново." };
  }

  return { success: true };
}
