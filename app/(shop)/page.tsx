import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/product-card";
import { connection } from "next/server";
import { Suspense } from "react";

async function Highlights() {
  await connection();
  const products = await prisma.product.findMany({
    take: 3,
    include: { images: true }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          slug={product.slug}
          price={Number(product.price)}
          image={product.images[0]?.url || "/Hero Background.webp"}
        />
      ))}
    </div>
  );
}

function HighlightsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-100 mb-4" />
          <div className="h-6 bg-gray-100 w-3/4 mx-auto mb-2" />
          <div className="h-4 bg-gray-100 w-1/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}

/**
 * Home Page Component
 * 
 * Displays the hero section with the brand statement and a curated list of seasonal highlights.
 * Uses a responsive layout that adapts from strict grid on desktop to stacked on mobile.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0 opacity-60">
          {/* Dramatic flower background */}
          <div className="w-full h-full relative">
            <Image
              src="/Hero Background.webp"
              alt="Hero Background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 space-y-6 animate-fade-in">
          <span className="text-sm tracking-[0.3em] uppercase opacity-90 block mb-4">Est. 2026</span>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-tight">
            Ivy Avenue
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto opacity-90">
            Timeless Faux Florals. Refined. Monochrome. Forever.
          </p>
          <div className="pt-8">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-none px-12 py-6 text-lg tracking-widest uppercase">
                Shop Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Highlights */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif">Curated Highlights</h2>
          <p className="text-gray-500 max-w-md mx-auto">Selected stems and arrangements for the season.</p>
        </div>

        <Suspense fallback={<HighlightsSkeleton />}>
          <Highlights />
        </Suspense>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
