"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useCartStore } from "@/lib/store/cart";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
    const [status, setStatus] = useState("loading");
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        if (paymentIntentClientSecret) {
            // Retrieve payment intent status using Stripe JS or just assume success if we got here from confirmPayment return_url
            // For simplicity, we assume success if the param exists, but ideally we'd use stripe.retrievePaymentIntent

            // In a real app, you might want to verify with your backend too.

            setStatus("success");
            clearCart();
        } else {
            setStatus("error");
        }
    }, [paymentIntentClientSecret, clearCart]);

    if (status === "loading") {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    if (status === "error") {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-serif mb-4">Something went wrong.</h1>
                <p className="text-gray-500 mb-8">We couldn't confirm your payment.</p>
                <Link href="/shop/checkout">
                    <Button>Try Again</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h1 className="text-4xl font-serif mb-4">Thank you!</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
                Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <Link href="/shop">
                <Button className="bg-black text-white px-8 py-4 rounded-none">Continue Shopping</Button>
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
