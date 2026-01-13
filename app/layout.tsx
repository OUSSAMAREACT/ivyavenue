import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ivyavenue.fluxstudio.cloud"),
  title: {
    default: "Ivy Avenue | Refined Faux Florals",
    template: "%s | Ivy Avenue",
  },
  description: "Browse our collection of refined, monochrome faux stems and arrangements. Timeless beauty for the modern home.",
  keywords: ["faux florals", "artificial flowers", "monochrome decor", "home decor", "silk flowers", "minimalist design"],
  authors: [{ name: "Ivy Avenue" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ivyavenue.com",
    title: "Ivy Avenue | Refined Faux Florals",
    description: "Timeless faux florals, curated for the modern home.",
    siteName: "Ivy Avenue",
    images: [
      {
        url: "/Hero Background.webp",
        width: 1200,
        height: 630,
        alt: "Ivy Avenue Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivy Avenue | Refined Faux Florals",
    description: "Timeless faux florals, curated for the modern home.",
    images: ["/Hero Background.webp"],
  },
};

import { CartSync } from "@/components/cart-sync";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className="antialiased bg-white text-black font-sans selection:bg-black selection:text-white"
      >
        <CartSync />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
