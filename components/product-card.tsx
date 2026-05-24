"use client"

import { useRouter } from "next/navigation"

export default function ProductCard({
  item
}: {
  item: any
}) {

  const router = useRouter()

  async function reserve() {

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: item.productId,
        warehouseId: item.warehouseId,
        quantity: 1
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    router.push(`/reservation/${data.id}`)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 transition hover:shadow-md">

      <div className="space-y-3">

        <h2 className="text-2xl font-bold text-slate-900">
          {item.product}
        </h2>

        <div className="space-y-1 text-slate-600">

          <p>
            Warehouse:
            <span className="font-medium text-slate-800 ml-2">
              {item.warehouse}
            </span>
          </p>

          <p>
            Available Stock:
            <span className="font-semibold text-emerald-600 ml-2">
              {item.available}
            </span>
          </p>

        </div>

        <button
          onClick={reserve}
          className="mt-4 bg-slate-900 hover:bg-slate-700 transition text-white px-5 py-2.5 rounded-xl font-medium"
        >
          Reserve
        </button>

      </div>
    </div>
  )
}