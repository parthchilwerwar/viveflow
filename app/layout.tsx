import type React from "react"
import "@/app/globals.css"
import "@/styles/reactflow.css"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Metadata } from 'next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: 'ViveFlow - Transform Ideas into Actionable Frameworks',
  description: 'ViveFlow helps you organize thoughts, create structured plans, and visualize your ideas in beautiful interactive mindmaps.',
  icons: {
    icon: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ViveFlow - Transform Ideas into Actionable Frameworks</title>
        <meta name="description" content="AI-powered ideation and strategy assistant" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            {/* No header here - moved to individual page components */}
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
