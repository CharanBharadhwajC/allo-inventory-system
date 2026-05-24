"use client"

import { useEffect, useState } from "react"

export default function Countdown({
  expiresAt
}: {
  expiresAt: string
}) {

  const [remaining, setRemaining] = useState(0)

  useEffect(() => {

    const interval = setInterval(() => {

      const diff =
        new Date(expiresAt).getTime() -
        Date.now()

      setRemaining(diff)

    }, 1000)

    return () => clearInterval(interval)

  }, [expiresAt])

  if (remaining <= 0) {
    return (
      <p className="text-red-600 font-medium">
        Reservation expired
      </p>
    )
  }

  const seconds =
    Math.floor(remaining / 1000)

  return (
    <p className="text-slate-700 font-medium">
      Reservation expires in {seconds}s
    </p>
  )
}