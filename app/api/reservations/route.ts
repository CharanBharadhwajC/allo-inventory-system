import { NextRequest, NextResponse } from "next/server"
import { reservationSchema } from "@/lib/validations"
import { createReservation } from "@/lib/reservation"

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()

    const validated =
      reservationSchema.parse(body)

    const reservation =
      await createReservation(
        validated.productId,
        validated.warehouseId,
        validated.quantity
      )

    return NextResponse.json(reservation)

  } catch (err: any) {

    if (err.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        {
          error: "Not enough stock"
        },
        {
          status: 409
        }
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error"
      },
      {
        status: 500
      }
    )
  }
}