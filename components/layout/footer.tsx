import Link from "next/link";
import { Instagram, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

                {/* Brand */}
                <div className="text-center md:text-left space-y-4">
                    <Link href="/" className="font-serif text-3xl tracking-tight block">
                        IVY AVENUE
                    </Link>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
                        Timeless faux florals, curated for the modern home.
                        Elevating spaces with everlasting beauty.
                    </p>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-medium text-gray-600">
                    <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
                    <Link href="/about" className="hover:text-black transition-colors">Our Story</Link>
                    <Link href="/journal" className="hover:text-black transition-colors">Journal</Link>
                    <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
                </div>

                {/* Social & Legal */}
                <div className="flex flex-col items-center md:items-end gap-6 text-gray-500">
                    <a
                        href="https://www.instagram.com/ivyavenuefloral/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-black transition-colors group"
                    >
                        <span className="text-sm font-medium">Follow us on Instagram</span>
                        <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>

                    <div className="text-xs text-center md:text-right space-y-1">
                        <p>&copy; 2026 Ivy Avenue. All rights reserved.</p>
                        <div className="flex gap-4 justify-center md:justify-end">
                            <Link href="/privacy" className="hover:text-black underline decoration-gray-300 underline-offset-4">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-black underline decoration-gray-300 underline-offset-4">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
