"use client";

import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal } = useCartStore();
    const total = subtotal();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8 max-w-md">
                    Looks like you haven't added any stems or arrangements to your collection yet.
                </p>
                <Link href="/shop">
                    <Button className="bg-black text-white px-8 py-6 text-lg rounded-none hover:bg-gray-800 transition-all">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
            <h1 className="font-serif text-4xl mb-12">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-8">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8 last:border-0">
                            {/* Image */}
                            <div className="relative w-24 h-32 lg:w-32 lg:h-40 flex-shrink-0 bg-gray-50 border border-gray-100">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/shop/${item.slug}`} className="font-medium text-lg hover:underline decoration-gray-400 underline-offset-4">
                                            {item.name}
                                        </Link>
                                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">${item.price.toFixed(2)} each</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-4 bg-gray-50 px-3 py-1 border border-gray-100">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="text-gray-500 hover:text-black transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-gray-500 hover:text-black transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-50 p-8 border border-gray-100 sticky top-24">
                        <h2 className="font-serif text-xl mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-400">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mb-8 flex justify-between items-center">
                            <span className="font-serif text-lg">Total</span>
                            <span className="font-medium text-xl">${total.toFixed(2)}</span>
                        </div>

                        <Link href="/shop/checkout">
                            <Button className="w-full bg-black text-white py-6 rounded-none text-base hover:bg-gray-800 transition-all">
                                Proceed to Checkout
                            </Button>
                        </Link>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Taxes and shipping calculated at checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
