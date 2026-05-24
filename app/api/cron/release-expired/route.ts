import { releaseExpiredReservations } from "@/lib/expiry"
import { NextResponse } from "next/server"

export async function GET() {

  const released =
    await releaseExpiredReservations()

  return NextResponse.json({
    success: true,
    released
  })
}