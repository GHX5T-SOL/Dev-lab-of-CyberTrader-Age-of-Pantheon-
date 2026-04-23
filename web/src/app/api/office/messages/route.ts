import { NextResponse } from "next/server";
import { createOfficeMessage, listOfficeMessages } from "@/lib/officeState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ messages: listOfficeMessages() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    from?: "ghost" | "zoro";
    to?: string;
    message?: string;
  };

  if (!payload.from || !payload.to || !payload.message?.trim()) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const message = createOfficeMessage({
    from: payload.from,
    to: payload.to,
    message: payload.message,
  });

  return NextResponse.json({ ok: true, message });
}
