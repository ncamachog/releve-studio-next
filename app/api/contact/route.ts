import { NextResponse } from "next/server";
import { addMessage } from "@/lib/messages";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }
  const r = await addMessage(body);
  if (!r.ok) return NextResponse.json({ message: r.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
