import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

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
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-black bg-white selection:bg-black selection:text-white`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
        <CartSync />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
