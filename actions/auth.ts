"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username");
    const password = formData.get("password");

    // TODO: Use Env Vars or Database in production
    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "ivy2026";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        redirect("/admin");
    }

    return { error: "Invalid credentials. Please try again." };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin/login");
}
