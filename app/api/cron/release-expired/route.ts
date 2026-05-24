import { releaseExpiredReservations } from "@/lib/expiry"
import { NextResponse } from "next/server"

export async function GET() {

  await releaseExpiredReservations()

  return NextResponse.json({
    success: true
  })
}