import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { isInWishlist } from "@/actions/wishlist";
import { getRelatedProducts } from "@/actions/product";
import { ProductCard } from "@/components/ui/product-card";
import { AddToCart } from "@/components/shop/add-to-cart";

async function ProductDetails({ slug }: { slug: string }) {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            images: true,
            category: {
                include: {
                    products: {
                        take: 4,
                        where: { slug: { not: slug } },
                        include: { images: true }
                    }
                }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const inWishlist = await isInWishlist(product.id);
    const relatedProducts = await getRelatedProducts(product.id);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden w-full">
                    <Image
                        src={product.images[0]?.url || ''}
                        fill
                        className="object-cover"
                        alt={product.name}
                        priority
                    />
                    <div className="absolute top-4 right-4 z-10">
                        <WishlistButton
                            productId={product.id}
                            initialIsInWishlist={inWishlist}
                            className="bg-white/80 backdrop-blur-sm shadow-sm"
                        />
                    </div>
                </div>
                {/* Thumbnails would go here */}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
                <div>
                    <p className="text-gray-500 uppercase tracking-widest text-sm mb-2">{product.category.name}</p>
                    <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
                    <p className="text-xl text-gray-900 font-medium">${Number(product.price).toFixed(2)}</p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <AddToCart
                            product={{
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                image: product.images[0]?.url || '',
                                slug: product.slug
                            }}
                        />
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <span>Free Shipping on orders over $150</span>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="col-span-full mt-24 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif text-center mb-12">Customer Reviews</h2>
                    <div className="text-center text-gray-500 italic">No reviews yet. Be the first to review this {product.category.name.toLowerCase()}.</div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="col-span-full mt-20 pt-20 border-t border-gray-100">
                        <h2 className="text-3xl font-serif text-center mb-12">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p: any) => (
                                <ProductCard
                                    key={p.id}
                                    id={p.id}
                                    name={p.name}
                                    slug={p.slug}
                                    price={Number(p.price)}
                                    image={p.images[0]?.url || ''}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            );
}

            export default async function ProductPage({params}: {params: Promise<{ slug: string }> }) {
    const {slug} = await params;

            return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
                    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
                        <ProductDetails slug={slug} />
                    </Suspense>
                </div>
            </div>
            );
}
