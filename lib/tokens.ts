import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export async function generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 Hour

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) return null;

    // Update user with new token
    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expires
        }
    });

    return token;
}

export async function verifyResetToken(token: string) {
    const user = await prisma.user.findFirst({
        where: { resetToken: token }
    });

    if (!user) return null;

    const hasExpired = new Date() > new Date(user.resetTokenExpiry!);

    if (hasExpired) {
        return null;
    }

    return user;
}
