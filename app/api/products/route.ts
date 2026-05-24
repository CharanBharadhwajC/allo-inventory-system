import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {

  const inventories = await prisma.inventory.findMany({
    include: {
      product: true,
      warehouse: true
    }
  })

  const result = inventories.map((item) => ({
    inventoryId: item.id,
    productId: item.productId,
    warehouseId: item.warehouseId,
    product: item.product.name,
    warehouse: item.warehouse.name,
    available:
      item.totalQuantity -
      item.reservedQuantity
  }))

  return NextResponse.json(result)
}