import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // <--- This line is crucial!

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nature Weather App",
  description: "Your personal weather dashboard with AI insights and nature context.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
