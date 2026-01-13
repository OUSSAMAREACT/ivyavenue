"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPaymentIntent } from "@/actions/checkout";

// Make sure to load Stripe outside of component render
// In a real app, you should fetch the publishable key from an env var OR an API endpoint if it's dynamic like the secret key.
// Since we made everything dynamic, we need to fetch the publishable key from the server too!
// ... Actually, `loadStripe` expects a string. If we fetch it async, we need a provider or useEffect.
// For now, let's assume we can fetch it via a server action or API route.
// Let's create a server action "getStoreConfig" to get the publishable key.

// Wait, I can't restart the whole plan for that.
// Let's use a placeholder env var for now, or better:
// If the user setup "Admin Managed", we MUST fetch it.
// I'll add a helper to fetch the key in the component.

function CheckoutForm({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/shop/success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button disabled={isLoading || !stripe || !elements} className="w-full bg-black text-white py-6 rounded-none text-base hover:bg-gray-800">
                {isLoading ? "Processing..." : "Pay Now"}
            </Button>
            {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
        </form>
    );
}

export default function CheckoutPage() {
    const { items, subtotal } = useCartStore();
    const total = subtotal();

    // Form State
    const [shippingDetails, setShippingDetails] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "US"
    });

    const [clientSecret, setClientSecret] = useState("");
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [step, setStep] = useState<1 | 2>(1); // 1 = Details, 2 = Payment
    const [error, setError] = useState("");

    // Fetch Publishable Key on Mount
    useEffect(() => {
        fetch("/api/config/stripe").then(res => res.json()).then(data => {
            if (data.publishableKey) {
                setStripePromise(loadStripe(data.publishableKey));
            }
        });
    }, []);

    const initPayment = async () => {
        if (!shippingDetails.email || !shippingDetails.address) {
            setError("Please fill in all shipping details.");
            return;
        }

        setError("");

        const res = await createPaymentIntent(
            items.map(i => ({ id: i.id, quantity: i.quantity })),
            shippingDetails
        );

        if (res.error) {
            setError(res.error);
        } else if (res.clientSecret) {
            setClientSecret(res.clientSecret);
            setStep(2);
        }
    };

    if (items.length === 0) {
        return <div className="p-12 text-center">Your cart is empty.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="font-serif text-3xl mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Forms */}
                <div>
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="font-medium text-xl mb-4">Shipping Information</h2>
                            <Input
                                placeholder="Email"
                                value={shippingDetails.email}
                                onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="First Name"
                                    value={shippingDetails.firstName}
                                    onChange={e => setShippingDetails({ ...shippingDetails, firstName: e.target.value })}
                                />
                                <Input
                                    placeholder="Last Name"
                                    value={shippingDetails.lastName}
                                    onChange={e => setShippingDetails({ ...shippingDetails, lastName: e.target.value })}
                                />
                            </div>
                            <Input
                                placeholder="Address"
                                value={shippingDetails.address}
                                onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="City"
                                    value={shippingDetails.city}
                                    onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                />
                                <Input
                                    placeholder="Postal Code"
                                    value={shippingDetails.postalCode}
                                    onChange={e => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                                />
                            </div>

                            <Button onClick={initPayment} className="w-full bg-black text-white py-6 mt-6 rounded-none">
                                Continue to Payment
                            </Button>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                    )}

                    {step === 2 && clientSecret && stripePromise && (
                        <div className="space-y-4">
                            <h2 className="font-medium text-xl mb-4">Payment</h2>
                            <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                <CheckoutForm clientSecret={clientSecret} onSuccess={() => { }} />
                            </Elements>
                            <button onClick={() => setStep(1)} className="text-sm underline text-gray-500 mt-4">Back to details</button>
                        </div>
                    )}
                </div>

                {/* Right: Order Summary */}
                <div className="bg-gray-50 p-6 h-fit sticky top-24">
                    <h3 className="font-serif text-lg mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-6">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
