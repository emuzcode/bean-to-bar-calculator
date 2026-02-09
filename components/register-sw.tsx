"use client"

import { useEffect } from "react"

export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch((err) => {
        console.warn("SW registration failed:", err)
      })
    }
  }, [])

  return null
}

