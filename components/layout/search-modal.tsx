"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");

    // Close on route change (optional, but good UX)
    // For now, we'll keep it simple.

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
                    <Search className="w-5 h-5 text-gray-900" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <div className="flex items-center border-b border-gray-100 p-4">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for stems, bouquets..."
                        className="border-none shadow-none focus-visible:ring-0 text-lg px-0 h-auto placeholder:text-gray-300"
                        autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-transparent">
                        <X className="w-5 h-5 text-gray-400" />
                    </Button>
                </div>

                <div className="p-6 bg-gray-50 min-h-[300px]">
                    {!query && (
                        <div className="text-center text-gray-400 py-10">
                            <p className="text-sm uppercase tracking-widest mb-2">Popular Searches</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['White Rose', 'Eucalyptus', 'Peony', 'Vases'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-black hover:text-black transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {query && (
                        <div className="text-center py-10 text-gray-500">
                            Searching for "{query}"...
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
