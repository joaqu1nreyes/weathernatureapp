"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { useEffect } from "react"

// Font loader must be at module scope
const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    async function readyFarcaster() {
      if (typeof window !== "undefined") {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        sdk.actions.ready();
      }
    }
    readyFarcaster();
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
