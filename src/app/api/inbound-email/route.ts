import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resend wraps inbound email payload inside body.data
    const data = (body.data ?? body) as Record<string, unknown>;

    const from: string = (data.from as string) ?? "";
    const toRaw = data.to;
    const to: string = Array.isArray(toRaw) ? toRaw[0] : ((toRaw as string) ?? "");
    const subject: string = (data.subject as string) ?? "(no subject)";
    const text: string | null = (data.text as string) ?? (data.plain_text as string) ?? null;
    const html: string | null = (data.html as string) ?? null;

    await prisma.inboundEmail.create({
      data: { from, to, subject, text, html, rawPayload: body },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inbound-email] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
