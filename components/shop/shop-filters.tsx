"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

export function ShopFilters() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get active filters from URL
    const activeCategory = searchParams.get("category");
    const activeColor = searchParams.get("color");
    const activePrice = searchParams.get("price");

    // Close dropdowns on outside click (simplified)
    useEffect(() => {
        const handleClick = () => setActiveDropdown(null);
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    const updateFilter = (type: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            // Toggle off if same value clicked
            if (params.get(type) === value) {
                params.delete(type);
            } else {
                params.set(type, value);
            }
        } else {
            params.delete(type);
        }

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const colors = [
        { name: "White", hex: "#FFFFFF", border: true, slug: "white" },
        { name: "Black", hex: "#000000", slug: "black" },
        { name: "Cream", hex: "#F5F5DC", slug: "cream" },
        { name: "Blush", hex: "#FFE4E1", slug: "blush" },
        { name: "Red", hex: "#8B0000", slug: "red" },
        { name: "Green", hex: "#2F4F4F", slug: "green" },
    ];

    const categories = [
        { name: 'Individual Stems', slug: 'individual-stems' },
        { name: 'Bouquets', slug: 'bouquets' },
        { name: 'Vases', slug: 'vases' }
    ];

    // Simplification: Price Logic (Frontend Only mostly unless backend logic updated)
    // For now keeping purely UI or mapping to backend if needed.
    // Assuming backend takes 'min' and 'max'? Or 'priceRange'?
    // Let's stick to simple "sort" or basic filtering for now or UX only.
    // Given the prompt, let's make it work for Category specifically as that's implemented in Page.
    // And add Color hook.

    const toggleDropdown = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const hasActiveFilters = activeCategory || activeColor || activePrice;

    const FilterDrawerContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div
                            key={cat.slug}
                            onClick={() => updateFilter("category", cat.slug)}
                            className="flex items-center space-x-2 cursor-pointer group"
                        >
                            <div className={cn(
                                "w-4 h-4 border transition-colors flex items-center justify-center",
                                activeCategory === cat.slug ? "bg-black border-black" : "border-gray-300 group-hover:border-black"
                            )}>
                                {activeCategory === cat.slug && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={cn(
                                "text-sm transition-colors",
                                activeCategory === cat.slug ? "text-black font-medium" : "text-gray-600 group-hover:text-black"
                            )}>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Colour</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <div
                            key={color.name}
                            onClick={() => updateFilter("color", color.slug)}
                            className="flex flex-col items-center gap-1 cursor-pointer group"
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full border shadow-sm transition-transform group-hover:scale-110 flex items-center justify-center relative",
                                    color.border ? "border-gray-200" : "border-transparent",
                                    activeColor === color.slug && "ring-2 ring-black ring-offset-2"
                                )}
                                style={{ backgroundColor: color.hex }}
                            />
                            <span className={cn(
                                "text-[10px] uppercase tracking-wide",
                                activeColor === color.slug ? "text-black font-bold" : "text-gray-500"
                            )}>{color.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full mb-8 relative z-30">
            {/* Desktop Horizontal Bar - Sticky */}
            <div className="hidden md:flex items-center justify-between border-b border-gray-100 pb-4 sticky top-[64px] bg-white pt-4 transition-all" id="desktop-filter-bar">
                <div className="flex items-center gap-6">
                    <span className="font-serif text-gray-400 italic mr-2">Filter by:</span>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <button
                            onClick={(e) => toggleDropdown(e, 'category')}
                            className={cn(
                                "flex items-center gap-2 text-sm uppercase tracking-wider hover:text-black transition-colors",
                                activeCategory ? "text-black font-medium" : "text-gray-600"
                            )}
                        >
                            Category {activeCategory && <span className="bg-black text-white text-[10px] px-1.5 rounded-full">1</span>}
                            <ChevronDown className={cn("w-3 h-3 transition-transform", activeDropdown === 'category' && "rotate-180")} />
                        </button>
                        {activeDropdown === 'category' && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-4 min-w-[200px] rounded-lg animate-in fade-in slide-in-from-top-2 space-y-2"
                            >
                                {categories.map((c) => (
                                    <div
                                        key={c.slug}
                                        onClick={() => {
                                            updateFilter("category", c.slug);
                                            setActiveDropdown(null);
                                        }}
                                        className={cn(
                                            "text-sm cursor-pointer px-2 py-1.5 rounded hover:bg-gray-50 transition-colors flex justify-between items-center",
                                            activeCategory === c.slug ? "text-black font-medium bg-gray-50" : "text-gray-600"
                                        )}
                                    >
                                        {c.name}
                                        {activeCategory === c.slug && <Check className="w-3 h-3" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colour Dropdown */}
                    <div className="relative">
                        <button
                            onClick={(e) => toggleDropdown(e, 'colour')}
                            className={cn(
                                "flex items-center gap-2 text-sm uppercase tracking-wider hover:text-black transition-colors",
                                activeColor ? "text-black font-medium" : "text-gray-600"
                            )}
                        >
                            Colour {activeColor && <span className="bg-black text-white text-[10px] px-1.5 rounded-full">1</span>}
                            <ChevronDown className={cn("w-3 h-3 transition-transform", activeDropdown === 'colour' && "rotate-180")} />
                        </button>
                        {activeDropdown === 'colour' && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-4 min-w-[240px] rounded-lg animate-in fade-in slide-in-from-top-2 grid grid-cols-3 gap-3"
                            >
                                {colors.map((color) => (
                                    <div
                                        key={color.name}
                                        onClick={() => {
                                            updateFilter("color", color.slug);
                                            setActiveDropdown(null);
                                        }}
                                        className={cn(
                                            "h-8 w-8 rounded-full border cursor-pointer hover:scale-110 transition-transform relative flex items-center justify-center",
                                            color.border ? "border-gray-200" : "border-transparent",
                                            activeColor === color.slug && "ring-2 ring-black ring-offset-1"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    >
                                        {activeColor === color.slug && color.slug === 'white' && <Check className="w-4 h-4 text-black" />}
                                        {activeColor === color.slug && color.slug !== 'white' && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Dropdown */}
                    <div className="relative">
                        <button
                            onClick={(e) => toggleDropdown(e, 'price')}
                            className={cn(
                                "flex items-center gap-2 text-sm uppercase tracking-wider hover:text-black transition-colors",
                                (searchParams.get("minPrice") || searchParams.get("maxPrice")) ? "text-black font-medium" : "text-gray-600"
                            )}
                        >
                            Price
                            {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && <span className="bg-black text-white text-[10px] px-1.5 rounded-full">1</span>}
                            <ChevronDown className={cn("w-3 h-3 transition-transform", activeDropdown === 'price' && "rotate-180")} />
                        </button>
                        {activeDropdown === 'price' && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-6 min-w-[280px] rounded-lg animate-in fade-in slide-in-from-top-2 z-50"
                            >
                                <div className="space-y-6">
                                    <h4 className="font-medium text-sm">Price Range</h4>
                                    <Slider
                                        defaultValue={[
                                            Number(searchParams.get("minPrice") || 0),
                                            Number(searchParams.get("maxPrice") || 200)
                                        ]}
                                        max={200}
                                        step={5}
                                        onValueCommit={(value) => {
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set("minPrice", value[0].toString());
                                            params.set("maxPrice", value[1].toString());
                                            router.push(`/shop?${params.toString()}`, { scroll: false });
                                        }}
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>£{searchParams.get("minPrice") || 0}</span>
                                        <span>£{searchParams.get("maxPrice") || 200}</span>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={(e) => {
                                                toggleDropdown(e, 'price');
                                            }}
                                            className="text-xs text-black underline"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={(e) => toggleDropdown(e, 'sort')}
                            className={cn(
                                "flex items-center gap-2 text-sm uppercase tracking-wider hover:text-black transition-colors",
                                searchParams.get("sort") ? "text-black font-medium" : "text-gray-600"
                            )}
                        >
                            Sort By
                            <ChevronDown className={cn("w-3 h-3 transition-transform", activeDropdown === 'sort' && "rotate-180")} />
                        </button>
                        {activeDropdown === 'sort' && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-2 min-w-[180px] rounded-lg animate-in fade-in slide-in-from-top-2 flex flex-col z-50"
                            >
                                {[
                                    { label: "Newest", value: "newest" },
                                    { label: "Price: Low to High", value: "price_asc" },
                                    { label: "Price: High to Low", value: "price_desc" }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateFilter("sort", option.value);
                                            setActiveDropdown(null);
                                        }}
                                        className={cn(
                                            "text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors rounded",
                                            searchParams.get("sort") === option.value ? "font-medium text-black bg-gray-50" : "text-gray-600"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {hasActiveFilters && (
                        <button
                            onClick={() => router.push('/shop')}
                            className="text-xs text-red-500 hover:text-red-600 underline underline-offset-4"
                        >
                            Clear All
                        </button>
                    )}
                    <div className="text-sm text-gray-400">
                        Showing Results
                    </div>
                </div>
            </div>

            {/* Mobile Toggle Button - Sticky */}
            <div className="md:hidden w-full sticky top-[64px] z-30 py-2 bg-white transition-all shadow-sm">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-between px-6 bg-white text-black border border-gray-200 hover:bg-gray-50 transition-colors uppercase tracking-widest h-12"
                >
                    <span className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </span>
                    {hasActiveFilters && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Active</span>}
                </Button>
            </div>

            {/* Mobile Drawer (AnimatePresence) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black z-40 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 p-6 shadow-xl md:hidden overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-serif text-2xl">Refine</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <FilterDrawerContent />

                            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-black text-white hover:bg-gray-800 py-6 uppercase tracking-widest"
                                >
                                    View Results
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            router.push('/shop');
                                            setIsOpen(false);
                                        }}
                                        className="w-full py-6 uppercase tracking-widest border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
