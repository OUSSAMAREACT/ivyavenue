import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/actions/reset-password";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-100 shadow-sm">
                <Link href="/login" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-6">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                <h1 className="text-2xl font-serif mb-2">Forgot Password?</h1>
                <p className="text-gray-500 mb-6 text-sm">Enter your email and we'll send you a link to reset your password.</p>

                <form action={async (formData) => {
                    "use server";
                    await resetPassword(null, formData);
                    // In a real app we'd use useActionState to show the success message
                    // For MVP simplicity, we just submit.
                }}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input name="email" type="email" required placeholder="you@example.com" />
                        </div>
                        <Button type="submit" className="w-full bg-black text-white rounded-none">
                            Send Reset Link
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
