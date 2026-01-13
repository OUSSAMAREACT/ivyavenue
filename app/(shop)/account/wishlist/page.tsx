import { getSession } from "@/actions/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WishlistButton } from "@/components/ui/wishlist-button";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";



export default async function WishlistPage() {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    const wishlist = await prisma.wishlist.findMany({
        where: { userId: session.userId },
        include: {
            product: {
                include: { images: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-serif text-3xl">My Wishlist</h1>
                    <Link href="/account">
                        <Button variant="ghost" className="text-gray-500">Back to Account</Button>
                    </Link>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50">
                        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                        <Link href="/shop">
                            <Button className="rounded-none bg-black text-white px-8">Browse Shop</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {wishlist.map((item: any) => {
                            const product = item.product;
                            return (
                                <div key={product.id} className="group relative">
                                    <div className="aspect-[3/4] relative bg-gray-100 overflow-hidden mb-4">
                                        {product.images[0] && (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute top-4 right-4 z-10">
                                            <WishlistButton
                                                productId={product.id}
                                                initialIsInWishlist={true}
                                                className="bg-white/80 backdrop-blur-sm shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <Link href={`/shop/${product.slug}`} className="block">
                                        <h3 className="font-medium text-lg leading-tight mb-1 group-hover:underline decoration-1 underline-offset-4">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600">${Number(product.price).toFixed(2)}</p>
                                    </Link>

                                    {/* Optional: Add to Cart button directly here? */}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
