import { NextResponse } from "next/server";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }
  if (!verifyPassword(password)) {
    // Intentionally vague error + slight delay to discourage spam.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "access denied" }, { status: 401 });
  }
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
