import { cookies } from "next/headers";

const COOKIE = "releve_admin";

async function token(): Promise<string> {
  const pass = process.env.ADMIN_PASSWORD ?? "";
  const data = new TextEncoder().encode(`releve-admin:${pass}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return c !== undefined && c === (await token());
}

export async function login(password: string): Promise<boolean> {
  if (!adminConfigured() || password !== process.env.ADMIN_PASSWORD) return false;
  (await cookies()).set(COOKIE, await token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return true;
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
