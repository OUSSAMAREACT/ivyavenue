import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, FileText, Settings, LogOut, Package } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-gray-50 flex ${inter.className} ${playfair.variable}`}>
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-8 border-b border-white/10">
                    <span className="font-serif text-2xl tracking-tight">IVY AVENUE</span>
                    <span className="block text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin Panel</span>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <NavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
                    <NavLink href="/admin/orders" icon={<Package size={20} />} label="Orders" />
                    <NavLink href="/admin/categories" icon={<ShoppingBag size={20} />} label="Categories" />
                    <NavLink href="/admin/products" icon={<ShoppingBag size={20} />} label="Products" />
                    <NavLink href="/admin/pages" icon={<FileText size={20} />} label="Pages (CMS)" />
                    <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-6 border-t border-white/10">
                    <form action={async () => {
                        "use server";
                        await import("@/actions/auth").then(m => m.logout());
                    }}>
                        <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header (Placeholder) */}
                <header className="md:hidden bg-black text-white p-4 flex justify-between items-center">
                    <span className="font-serif text-xl">IVY AVENUE</span>
                    <button>Menu</button>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all group"
        >
            <span className="group-hover:text-white transition-colors">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
