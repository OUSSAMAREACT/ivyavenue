"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShopSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const FilterContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Category</h3>
                <div className="space-y-2">
                    {['Individual Stems', 'Bouquets', 'Vases'].map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                            <div className="w-4 h-4 border border-gray-300 group-hover:border-black transition-colors" />
                            <span className="text-sm text-gray-600 group-hover:text-black">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-serif text-lg border-b border-black pb-2 mb-4">Price</h3>
                <div className="space-y-2">
                    {['Under $20', '$20 - $50', '$50 - $100', 'Over $100'].map((price) => (
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
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden w-full mb-6">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter Products
                </Button>
            </div>

            {/* Desktop Sidebar (visible on md+) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <FilterContent />
            </aside>

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
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 p-6 shadow-xl md:hidden overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-serif text-xl">Filters</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <FilterContent />

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-black text-white hover:bg-gray-800"
                                >
                                    Show Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
