import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resend wraps inbound email payload inside body.data
    const data = (body.data ?? body) as Record<string, unknown>;

    const emailId = data.email_id as string | undefined;
    const from: string = (data.from as string) ?? "";
    const toRaw = data.to;
    const to: string = Array.isArray(toRaw) ? toRaw[0] : ((toRaw as string) ?? "");
    const subject: string = (data.subject as string) ?? "(no subject)";

    // Resend doesn't include body in the webhook — fetch it via their API
    let text: string | null = (data.text as string) ?? null;
    let html: string | null = (data.html as string) ?? null;

    if (!text && !html && emailId) {
      try {
        const res = await fetch(`https://api.resend.com/emails/${emailId}`, {
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        });
        if (res.ok) {
          const full = await res.json() as Record<string, unknown>;
          text = (full.text as string) ?? (full.plain_text as string) ?? null;
          html = (full.html as string) ?? null;
        }
      } catch (fetchErr) {
        console.error("[inbound-email] failed to fetch full email:", fetchErr);
      }
    }

    await prisma.inboundEmail.create({
      data: { from, to, subject, text, html, rawPayload: body },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inbound-email] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
