import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const settings = await prisma.storeSettings.findUnique({
        where: { id: "default" },
    });

    return NextResponse.json({
        publishableKey: settings?.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    });
}
