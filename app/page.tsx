export const dynamic = "force-dynamic"

import ProductCard from "@/components/product-card"
import { prisma } from "@/lib/prisma"

async function getProducts() {

  const inventories =
    await prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true
      }
    })

  return inventories.map((item) => ({
    inventoryId: item.id,
    productId: item.productId,
    warehouseId: item.warehouseId,
    product: item.product.name,
    warehouse: item.warehouse.name,
    available:
      item.totalQuantity -
      item.reservedQuantity
  }))
}

export default async function HomePage() {

  const products = await getProducts()

  return (
    <div className="space-y-10">

      <div className="space-y-3">

        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Allo Inventory System
        </h1>

        <p className="text-slate-600 text-lg">
          Concurrency-safe inventory reservation system
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {products.map((item: any) => (
          <ProductCard
            key={item.inventoryId}
            item={item}
          />
        ))}

      </div>
    </div>
  )
}