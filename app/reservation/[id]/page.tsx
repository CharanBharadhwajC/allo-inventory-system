import Countdown from "@/components/countdown"
import { prisma } from "@/lib/prisma"

async function getReservation(id: string) {

  return prisma.reservation.findUnique({
    where: {
      id
    },
    include: {
      product: true,
      warehouse: true
    }
  })
}

export default async function ReservationPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = await params

  const reservation =
    await getReservation(id)

  if (!reservation) {
    return (
      <div className="text-red-600">
        Reservation not found
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">

        <div className="space-y-2">

          <h1 className="text-4xl font-bold">
            Reservation Details
          </h1>

          <p className="text-slate-500">
            Review and confirm your reservation
          </p>

        </div>

        <div className="space-y-3 text-lg">

          <p>
            <span className="font-semibold">
              Product:
            </span>{" "}
            {reservation.product.name}
          </p>

          <p>
            <span className="font-semibold">
              Warehouse:
            </span>{" "}
            {reservation.warehouse.name}
          </p>

          <p>
            <span className="font-semibold">
              Status:
            </span>{" "}
            <span className="text-emerald-600 font-semibold">
              {reservation.status}
            </span>
          </p>

        </div>

        <div className="bg-slate-100 rounded-xl p-4">

          <Countdown
            expiresAt={
              reservation.expiresAt.toISOString()
            }
          />

        </div>

        <div className="flex gap-4 pt-2">

          <form
            action={`/api/reservations/${reservation.id}/confirm`}
            method="POST"
          >
            <button className="bg-emerald-600 hover:bg-emerald-500 transition text-white px-5 py-3 rounded-xl font-medium">
              Confirm Purchase
            </button>
          </form>

          <form
            action={`/api/reservations/${reservation.id}/release`}
            method="POST"
          >
            <button className="bg-red-600 hover:bg-red-500 transition text-white px-5 py-3 rounded-xl font-medium">
              Cancel Reservation
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}