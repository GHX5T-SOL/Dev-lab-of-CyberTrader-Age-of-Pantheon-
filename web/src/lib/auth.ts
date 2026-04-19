import { cookies } from "next/headers";

const COOKIE_NAME = "devlab_session";
const COOKIE_VALUE = "authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function verifyPassword(input: string): boolean {
  const expected = process.env.DEV_LAB_PASSWORD ?? "2010";
  // Constant-time compare (small string — fine for non-critical auth).
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export function verifyCronBearer(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const provided = authHeader.replace(/^Bearer\s+/i, "");
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
