import { prisma } from "./prisma"
import { addMinutes } from "date-fns"

export async function createReservation(
  productId: string,
  warehouseId: string,
  quantity: number
) {

  return prisma.$transaction(async (tx) => {

    const inventoryRows =
      await tx.$queryRawUnsafe<any[]>((
        `
        SELECT * FROM "Inventory"
        WHERE "productId" = $1
        AND "warehouseId" = $2
        FOR UPDATE
        `
      ),
      productId,
      warehouseId
    )

    const inventory = inventoryRows[0]

    if (!inventory) {
      throw new Error(
        "INVENTORY_NOT_FOUND"
      )
    }

    const available =
      inventory.totalQuantity -
      inventory.reservedQuantity

    if (available < quantity) {
      throw new Error(
        "INSUFFICIENT_STOCK"
      )
    }

    await tx.inventory.update({
      where: {
        id: inventory.id
      },
      data: {
        reservedQuantity: {
          increment: quantity
        }
      }
    })

    const reservation =
      await tx.reservation.create({
        data: {
          productId,
          warehouseId,
          quantity,
          status: "PENDING",
          expiresAt: addMinutes(
            new Date(),
            1
          )
        }
      })

    return reservation
  })
}