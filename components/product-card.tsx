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

      if (res.status === 409) {
        alert("Not enough stock")
        return
      }

      alert(data.error || "Something went wrong")
      return
    }

    router.push(
      `/reservation/${data.id}`
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 transition hover:shadow-md">

      <div className="space-y-4">

        <div className="space-y-1">

          <h2 className="text-2xl font-bold text-slate-900">
            {item.product}
          </h2>

          <p className="text-slate-500">
            {item.warehouse}
          </p>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">

          <div className="flex items-center justify-between">

            <span className="text-slate-600">
              In Stock
            </span>

            <span className="font-semibold text-slate-900">
              {item.totalQuantity}
            </span>

          </div>

          <div className="flex items-center justify-between">

            <span className="text-slate-600">
              Reserved
            </span>

            <span className="font-semibold text-amber-600">
              {item.reservedQuantity}
            </span>

          </div>

          <div className="border-t border-slate-200 pt-2 flex items-center justify-between">

            <span className="text-slate-700 font-medium">
              Available to Purchase
            </span>

            <span className="font-bold text-emerald-600 text-base">
              {item.available}
            </span>

          </div>

        </div>

        <button
          onClick={reserve}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-700 transition text-white px-5 py-3 rounded-xl font-medium"
        >
          Reserve
        </button>

      </div>
    </div>
  )
}