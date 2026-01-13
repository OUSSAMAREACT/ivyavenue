import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { connection } from "next/server";
import { Suspense } from "react";
import { ShopFilters } from "@/components/shop/shop-filters";

/**
 * ProductGrid Component
 * Fetches and displays the product list.
 */
async function ProductGrid({ searchParams }: { searchParams: { category?: string } }) {
    await connection(); // Opt-in to dynamic rendering

    // Build where clause
    const where: any = {};
    if (searchParams.category) {
        where.category = {
            slug: searchParams.category
        };
    }

    const products = await prisma.product.findMany({
        where,
        include: { images: true, category: true }
    });

    return (
        <div className="flex-1">
            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No products found in this category.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            slug={product.slug}
                            price={Number(product.price)}
                            image={product.images[0]?.url || '/Hero Background.webp'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Shop Page Component
 * 
 * Displays the shop layout with a Suspense boundary for the product grid.
 */

export const metadata = {
    title: "The Collection",
    description: "Explore our range of meticulously crafted faux stems, arranged for timeless elegance.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const params = await searchParams; // Next.js 15+ async searchParams

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header */}
            <div className="bg-black text-white py-12 px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif">The Collection</h1>
                <p className="mt-4 text-gray-400 max-w-lg mx-auto">Explore our range of meticulously crafted faux stems, arranged for timeless elegance.</p>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
                {/* Visual Filters (Desktop Horizontal + Mobile Drawer) */}
                <ShopFilters />

                {/* Product Grid with Suspense */}
                <Suspense fallback={<div className="flex-1 text-center py-20">Loading collection...</div>}>
                    <ProductGrid searchParams={params} />
                </Suspense>
            </div>
        </div>
    );
}
