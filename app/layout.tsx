import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { useEffect } from "react"

export const metadata: Metadata = {
  title: "Nature Weather App",
  description: "Your personal weather dashboard with AI insights and nature context.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@farcaster/miniapp-sdk").then(({ sdk }) => {
        sdk.actions.ready()
      })
    }
  }, [])

  return (
    <html lang="en">
      <body className={Inter({ subsets: ["latin"] }).className}>{children}</body>
    </html>
  )
}
