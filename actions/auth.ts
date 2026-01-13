"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key-change-in-prod");

export async function register(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!email || !password || !name) {
        return { error: "Missing required fields." };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "User already exists with this email." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
            },
        });

        // Create Session
        await createSession(user.id);

        redirect("/account");
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Registration Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Missing required fields." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Invalid credentials." };
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return { error: "Invalid credentials." };
        }

        // Create Session
        await createSession(user.id);

        redirect("/account");
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") throw error;
        console.error("Login Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

async function createSession(userId: string) {
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as { userId: string };
    } catch (error) {
        return null;
    }
}
