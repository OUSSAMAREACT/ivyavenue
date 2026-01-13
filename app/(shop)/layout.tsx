import { Footer } from "@/components/layout/footer";
import { SearchModal } from "@/components/layout/search-modal";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-serif text-2xl tracking-tight hover:opacity-80 transition-opacity">
                            IVY AVENUE
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-black transition-colors">Our Story</Link>
                        <Link href="/journal" className="hover:text-black transition-colors">Journal</Link>
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4">
                        <SearchModal />
                        <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <ShoppingBag className="w-5 h-5 text-gray-900" />
                            {/* Cart Badge Placeholder */}
                            <span className="absolute top-1 right-0.5 w-2 h-2 bg-black rounded-full" />
                        </Link>
                    </div>
                </div>
            </header>

            {children}
            <Footer />
        </>
    );
}
