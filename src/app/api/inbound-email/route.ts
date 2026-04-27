import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    console.log("[inbound-email] raw body:", raw.slice(0, 2000));

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      console.error("[inbound-email] failed to parse JSON:", raw.slice(0, 500));
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("[inbound-email] keys received:", Object.keys(body));

    // Resend inbound payload shape
    const from: string = (body.from as string) ?? "";
    const toRaw = body.to;
    const to: string = Array.isArray(toRaw) ? toRaw[0] : ((toRaw as string) ?? "");
    const subject: string = (body.subject as string) ?? "(no subject)";
    const text: string | null = (body.text as string) ?? null;
    const html: string | null = (body.html as string) ?? null;

    await prisma.inboundEmail.create({
      data: { from, to, subject, text, html },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inbound-email] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
