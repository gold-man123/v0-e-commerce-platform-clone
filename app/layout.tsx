import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ToastProvider } from "@/components/ui/toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "وادي - منصة التجارة الإلكترونية | Wadi E-commerce Platform",
  description: "منصة التجارة الإلكترونية الرائدة في موريتانيا | Leading e-commerce platform in Mauritania",
  generator: "v0.app",
  robots: "index, follow",
  keywords: "تجارة إلكترونية, موريتانيا, تسوق أونلاين, e-commerce, Mauritania, online shopping",
  authors: [{ name: "Wadi E-commerce" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <ToastProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </ToastProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
