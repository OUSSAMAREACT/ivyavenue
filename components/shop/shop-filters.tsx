"use client";

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShopFilters() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const colors = [
        { name: "White", hex: "#FFFFFF", border: true },
        { name: "Black", hex: "#000000" },
        { name: "Cream", hex: "#F5F5DC" },
        { name: "Blush", hex: "#FFE4E1" },
        { name: "Red", hex: "#8B0000" },
        { name: "Green", hex: "#2F4F4F" },
    ];

    const categories = ['Individual Stems', 'Bouquets', 'Vases'];
    const prices = ['Under $20', '$20 - $50', '$50 - $100', 'Over $100'];

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const FilterDrawerContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Category</h3>
                <div className="space-y-2">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                            <div className="w-4 h-4 border border-gray-300 group-hover:border-black transition-colors" />
                            <span className="text-sm text-gray-600 group-hover:text-black">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Colour</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <div key={color.name} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full border shadow-sm transition-transform group-hover:scale-110",
                                    color.border ? "border-gray-200" : "border-transparent"
                                )}
                                style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-[10px] text-gray-500 uppercase tracking-wide">{color.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Price</h3>
                <div className="space-y-2">
                    {prices.map((price) => (
                        <label key={price} className="flex items-center space-x-2 cursor-pointer group">
                            <div className="w-4 h-4 border border-gray-300 group-hover:border-black transition-colors" />
                            <span className="text-sm text-gray-600 group-hover:text-black">{price}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full mb-8">
            {/* Desktop Horizontal Bar */}
            <div className="hidden md:flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-6">
                    <span className="font-serif text-gray-400 italic mr-2">Filter by:</span>

                    {/* Colour Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('colour')}
                            className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-gray-600"
                        >
                            Colour <ChevronDown className="w-3 h-3" />
                        </button>
                        {activeDropdown === 'colour' && (
                            <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-4 min-w-[200px] z-50 animate-fade-in grid grid-cols-3 gap-3">
                                {colors.map((color) => (
                                    <div key={color.name} className="h-6 w-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }} title={color.name} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('category')}
                            className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-gray-600"
                        >
                            Category <ChevronDown className="w-3 h-3" />
                        </button>
                        {activeDropdown === 'category' && (
                            <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-4 min-w-[200px] z-50 animate-fade-in space-y-2">
                                {categories.map((c) => (
                                    <div key={c} className="text-sm text-gray-600 hover:text-black cursor-pointer">{c}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('price')}
                            className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-gray-600"
                        >
                            Price <ChevronDown className="w-3 h-3" />
                        </button>
                        {activeDropdown === 'price' && (
                            <div className="absolute top-full left-0 mt-4 bg-white border border-gray-100 shadow-xl p-4 min-w-[200px] z-50 animate-fade-in space-y-2">
                                {prices.map((p) => (
                                    <div key={p} className="text-sm text-gray-600 hover:text-black cursor-pointer">{p}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-sm text-gray-400">
                    Showing Results
                </div>
            </div>

            {/* Mobile Toggle Button */}
            <div className="md:hidden w-full">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors uppercase tracking-widest"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
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

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-black text-white hover:bg-gray-800 py-6 uppercase tracking-widest"
                                >
                                    View Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
