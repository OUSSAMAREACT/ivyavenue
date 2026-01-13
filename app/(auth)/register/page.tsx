"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full bg-white p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm">Join Ivy Avenue for exclusive access.</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input name="name" placeholder="Jane Doe" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input name="email" type="email" placeholder="jane@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input name="phone" type="tel" placeholder="+44 7911 123456" />
                        <p className="text-xs text-gray-500">Optional. Only for order updates.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input name="password" type="password" required />
                    </div>

                    {state.error && (
                        <p className="text-red-500 text-sm text-center">{state.error}</p>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full bg-black text-white rounded-none h-12">
                        {isPending ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="font-medium hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
