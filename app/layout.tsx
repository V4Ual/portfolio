import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://vishalsharma.dev"),
  title: {
    default: "Vishal Sharma | PERN Full-Stack Developer & Software Engineer",
    template: "%s | Vishal Sharma",
  },
  description:
    "Portfolio of Vishal Sharma, an experienced PERN Full-Stack Developer specializing in high-performance web applications, PostgreSQL, Express.js, React, Node.js, and Next.js.",
  keywords: [
    "Vishal Sharma",
    "Vishal Sharma Developer",
    "PERN Stack Developer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Engineer",
    "Node.js Backend Developer",
    "PostgreSQL Expert",
    "Web Application Architecture",
  ],
  authors: [{ name: "Vishal Sharma", url: "https://vishalsharma.dev" }],
  creator: "Vishal Sharma",
  publisher: "Vishal Sharma",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Vishal Sharma | PERN Full-Stack Developer Portfolio",
    description:
      "Explore full-stack web applications, scalable REST APIs, and modern frontend designs crafted with React, Next.js, Node.js, and PostgreSQL by Vishal Sharma.",
    siteName: "Vishal Sharma Portfolio",
    images: [
      {
        url: "/photo.png",
        width: 800,
        height: 1000,
        alt: "Vishal Sharma - PERN Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishal Sharma | PERN Full-Stack Developer",
    description:
      "Full-stack engineer specializing in PERN stack, Next.js, high-throughput backend APIs, and modern responsive user interfaces.",
    images: ["/photo.png"],
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
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-token",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://vishalsharma.dev/#person",
        "name": "Vishal Sharma",
        "jobTitle": "Full-Stack Developer",
        "description": "PERN stack developer specializing in PostgreSQL, Express.js, React, Node.js, and Next.js scalable web applications.",
        "url": "https://vishalsharma.dev",
        "image": "https://vishalsharma.dev/photo.png",
        "sameAs": [
          "https://github.com/V4Ual",
          "https://www.linkedin.com/in/vishal-sharma-6639a322a/"
        ],
        "knowsAbout": [
          "PERN Stack",
          "PostgreSQL",
          "Express.js",
          "React.js",
          "Node.js",
          "Next.js",
          "TypeScript",
          "RESTful APIs",
          "Database Architecture"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://vishalsharma.dev/#website",
        "url": "https://vishalsharma.dev",
        "name": "Vishal Sharma - PERN Full-Stack Developer Portfolio",
        "publisher": {
          "@id": "https://vishalsharma.dev/#person"
        }
      }
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${_geist.className}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

