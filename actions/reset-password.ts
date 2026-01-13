"use server";

import prisma from "@/lib/prisma";
import { generatePasswordResetToken, verifyResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function resetPassword(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    if (!email) return { error: "Email is required" };

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        // Return success even if user doesn't exist to prevent enumeration attacks
        return { success: "If an account exists, a reset email has been sent." };
    }

    const token = await generatePasswordResetToken(email);
    if (token) {
        await sendPasswordResetEmail(user.email, token, user.name || "Customer");
    }

    return { success: "If an account exists, a reset email has been sent." };
}

export async function newPassword(token: string | null, prevState: any, formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token) return { error: "Missing token" };
    if (!password || !confirmPassword) return { error: "Missing fields" };
    if (password !== confirmPassword) return { error: "Passwords do not match" };

    const user = await verifyResetToken(token);
    if (!user) return { error: "Invalid or expired token" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    return { success: "Password reset successfully. You can now login." };
}
