import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Kartik Goel",
  description: "Full Stack Engineer working on enhancing frontend systems. 7x Hackathon Winner.",
  keywords: ["Kartik Goel", "Full Stack Engineer", "React", "TypeScript", "Web Developer", "Software Engineer", "QuillBot"],
  authors: [{ name: "Kartik Goel" }],
  creator: "Kartik Goel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kartikgoel.com",
    siteName: "Kartik Goel",
    title: "Kartik Goel",
    description: "Full Stack Engineer working on enhancing frontend systems. 7x Hackathon Winner.",
  },
  twitter: {
    card: "summary",
    title: "Kartik Goel",
    description: "Full Stack Engineer working on enhancing frontend systems. 7x Hackathon Winner.",
    creator: "@kartikgoel",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
