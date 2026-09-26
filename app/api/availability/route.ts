import { NextResponse } from "next/server";
import { CAPACITY } from "@/lib/data";
import { bookedCounts } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ booked: await bookedCounts(), capacity: CAPACITY });
}
