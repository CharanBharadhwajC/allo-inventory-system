import { prisma } from "@/lib/prisma"
import { isExpired } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string
    }>
  }
) {

  const { id } = await context.params

  const reservation =
    await prisma.reservation.findUnique({
      where: {
        id
      }
    })

  if (!reservation) {

    return NextResponse.json(
      {
        error: "Reservation not found"
      },
      {
        status: 404
      }
    )
  }

  if (
    reservation.status !== "PENDING"
  ) {

    return NextResponse.json(
      {
        error:
          "Reservation is no longer active"
      },
      {
        status: 409
      }
    )
  }

  if (
    isExpired(reservation.expiresAt)
  ) {

    await prisma.$transaction(
      async (tx) => {

        await tx.inventory.updateMany({
          where: {
            productId:
              reservation.productId,
            warehouseId:
              reservation.warehouseId
          },
          data: {
            reservedQuantity: {
              decrement:
                reservation.quantity
            }
          }
        })

        await tx.reservation.update({
          where: {
            id: reservation.id
          },
          data: {
            status: "EXPIRED"
          }
        })
      }
    )

    return NextResponse.json(
      {
        error:
          "Reservation expired"
      },
      {
        status: 410
      }
    )
  }

  await prisma.$transaction(
    async (tx) => {

      const updated =
        await tx.reservation.updateMany({
          where: {
            id: reservation.id,
            status: "PENDING"
          },
          data: {
            status: "CONFIRMED",
            confirmedAt: new Date()
          }
        })

      if (updated.count === 0) {
        throw new Error(
          "RESERVATION_ALREADY_PROCESSED"
        )
      }

      await tx.inventory.updateMany({
        where: {
          productId:
            reservation.productId,
          warehouseId:
            reservation.warehouseId
        },
        data: {
          totalQuantity: {
            decrement:
              reservation.quantity
          },
          reservedQuantity: {
            decrement:
              reservation.quantity
          }
        }
      })
    }
  )

  return NextResponse.json({
    success: true
  })
}