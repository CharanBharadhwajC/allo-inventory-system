import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse"
    }
  })

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse"
    }
  })

  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15"
    }
  })

  const macbook = await prisma.product.create({
    data: {
      name: "MacBook Air"
    }
  })

  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: warehouse1.id,
        totalQuantity: 10
      },
      {
        productId: iphone.id,
        warehouseId: warehouse2.id,
        totalQuantity: 5
      },
      {
        productId: macbook.id,
        warehouseId: warehouse1.id,
        totalQuantity: 7
      }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })