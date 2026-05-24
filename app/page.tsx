import ProductCard from "@/components/product-card"

async function getProducts() {

  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store"
    }
  )

  return res.json()
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