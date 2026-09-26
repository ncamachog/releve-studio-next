import { NextResponse } from "next/server";
import { createBooking, type BookInput } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: BookInput;
  try {
    body = (await request.json()) as BookInput;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }
  const result = createBooking(body);
  if (!result.ok) return NextResponse.json({ message: result.message }, { status: result.status });
  return NextResponse.json({ ok: true, ref: result.ref, total: result.total, count: result.count });
}
