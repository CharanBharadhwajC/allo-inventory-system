import { prisma } from "./prisma"

export async function releaseExpiredReservations() {

  const reservations = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lt: new Date()
      }
    }
  })

  for (const reservation of reservations) {

    await prisma.$transaction(async (tx) => {

      await tx.inventory.updateMany({
        where: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId
        },
        data: {
          reservedQuantity: {
            decrement: reservation.quantity
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
    })
  }
}