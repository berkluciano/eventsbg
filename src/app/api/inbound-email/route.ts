import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Resend sends: from, to (array), subject, text, html
    const from: string = body.from ?? "";
    const to: string = Array.isArray(body.to) ? body.to[0] : (body.to ?? "");
    const subject: string = body.subject ?? "(no subject)";
    const text: string | null = body.text ?? null;
    const html: string | null = body.html ?? null;

    await prisma.inboundEmail.create({
      data: { from, to, subject, text, html },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inbound email webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
