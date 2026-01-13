"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="max-w-md w-full bg-white p-8 shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Log in to view your orders.</p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input name="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input name="password" type="password" required />
                    </div>

                    {state.error && (
                        <p className="text-red-500 text-sm text-center">{state.error}</p>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full bg-black text-white rounded-none h-12">
                        {isPending ? "Logging in..." : "Log In"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Don't have an account? </span>
                    <Link href="/register" className="font-medium hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
