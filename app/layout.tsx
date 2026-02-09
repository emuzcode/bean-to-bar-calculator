import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { RegisterSW } from "@/components/register-sw"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const metadata: Metadata = {
  title: "Cacao Calculator",
  description:
    "Bean to Bar cacao formulation calculator for craft chocolate makers.",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cacao Calc",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: `${basePath}/icons/icon-192.svg`,
    apple: `${basePath}/icons/apple-touch-icon.svg`,
  },
}

export const viewport: Viewport = {
  themeColor: "#08090e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${_inter.variable} ${_jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <RegisterSW />
        {children}
      </body>
    </html>
  )
}
