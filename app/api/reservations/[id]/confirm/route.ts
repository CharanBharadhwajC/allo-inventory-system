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

      const inventory =
        await tx.inventory.findFirst({
          where: {
            productId:
              reservation.productId,
            warehouseId:
              reservation.warehouseId
          }
        })

      if (!inventory) {
        throw new Error(
          "INVENTORY_NOT_FOUND"
        )
      }

      await tx.inventory.update({
        where: {
          id: inventory.id
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

      await tx.reservation.update({
        where: {
          id: reservation.id
        },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date()
        }
      })
    }
  )

  return NextResponse.json({
    success: true
  })
}