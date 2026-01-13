"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newPassword } from "@/actions/reset-password";
import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";

export default function NewPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    // Wrapper to pass token
    const newPasswordWithToken = newPassword.bind(null, token);
    const [state, action, isPending] = useActionState(newPasswordWithToken, null);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
                Invalid or missing token.
            </div>
        );
    }

    if (state?.success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 border border-gray-100 shadow-sm text-center">
                    <h1 className="text-2xl font-serif mb-4">Password Reset!</h1>
                    <p className="text-green-600 mb-6">{state.success}</p>
                    <Button onClick={() => router.push("/login")} className="w-full bg-black text-white rounded-none">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-serif mb-2">Reset Password</h1>
                <p className="text-gray-500 mb-6 text-sm">Enter your new password below.</p>

                <form action={action} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <Input name="password" type="password" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm Password</label>
                        <Input name="confirmPassword" type="password" required />
                    </div>

                    {state?.error && (
                        <p className="text-red-500 text-sm">{state.error}</p>
                    )}

                    <Button type="submit" disabled={isPending} className="w-full bg-black text-white rounded-none flex items-center justify-center">
                        {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
