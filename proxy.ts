import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
        // Allow access to login page
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        // Check for session cookie
        const hasSession = request.cookies.has("session");

        if (!hasSession) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
