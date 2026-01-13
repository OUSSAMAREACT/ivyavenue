"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

import { subscribeToNewsletter } from "@/actions/newsletter";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

const initialState = {
    success: false,
    message: "",
};

export function NewsletterSection() {
    const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

    return (
        <section className="bg-black text-white py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-50 pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 tracking-wide">
                        Join the Inner Circle
                    </h2>
                    <p className="text-gray-300 mb-10 text-lg font-light max-w-xl mx-auto">
                        Receive exclusive access to new arrivals, styling tips from our florists, and seasonal inspiration directly to your inbox.
                    </p>

                    <form action={formAction} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            name="email"
                            type="email"
                            required
                            placeholder="Your email address"
                            className="bg-transparent border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white h-12 rounded-none"
                        />
                        <Button
                            disabled={isPending}
                            className="bg-white text-black hover:bg-gray-200 h-12 px-8 font-medium tracking-wide rounded-none disabled:opacity-70"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                        </Button>
                    </form>

                    {state.message && (
                        <p className={`mt-6 text-sm ${state.success ? "text-green-400" : "text-red-400"} animate-in fade-in`}>
                            {state.message}
                        </p>
                    )}

                    {!state.message && (
                        <p className="mt-6 text-xs text-gray-500">
                            By signing up, you agree to our Terms & Privacy Policy.
                        </p>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
