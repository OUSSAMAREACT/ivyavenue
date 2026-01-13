"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Access Dashboard
        </Button>
    );
}

// Define the state type
type LoginState = {
    error?: string;
} | null;

export default function AdminLogin() {
    // Explicitly cast the action to match the expected state type, or type the Hook
    const [state, formAction] = useActionState<LoginState, FormData>(login, null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white border border-gray-100 shadow-xl p-8 rounded-none">
                <div className="text-center mb-8 space-y-2">
                    <h1 className="font-serif text-3xl tracking-tight">Ivy Avenue</h1>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">Admin Access</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                        <Input name="email" type="email" required placeholder="admin@ivyavenue.com" className="rounded-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                        <Input name="password" type="password" required placeholder="••••••••" className="rounded-none" />
                    </div>
                    <SubmitButton />
                    {state?.error && (
                        <p className="text-red-500 text-sm text-center mt-4 bg-red-50 p-2 border border-red-100">
                            {state.error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
