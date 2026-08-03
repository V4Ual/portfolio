import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "PERN Full-Stack Developer | Vishal Sharma Portfolio",
    template: "%s | Vishal Sharma",
  },
  description:
    "Professional portfolio of a PERN stack developer showcasing projects, skills, experience, and expertise in PostgreSQL, Express.js, React.js, and Node.js",
  keywords: ["PERN", "Full-Stack Developer", "React", "Node.js", "PostgreSQL", "Express.js", "Web Development"],
  authors: [{ name: "Vishal Sharma" }],
  creator: "Vishal Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "PERN Full-Stack Developer | Vishal Sharma Portfolio",
    description: "Professional portfolio of a PERN stack developer showcasing projects, skills, experience, and expertise in PostgreSQL, Express.js, React.js, and Node.js",
    siteName: "Vishal Sharma Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Vishal Sharma Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PERN Full-Stack Developer | Vishal Sharma Portfolio",
    description: "Professional portfolio of a PERN stack developer showcasing projects, skills, experience, and expertise in PostgreSQL, Express.js, React.js, and Node.js",
    images: ["/logo.png"],
    creator: "@vishalsharma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
    apple: "/logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
