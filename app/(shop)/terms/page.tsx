import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { connection } from "next/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const page = await prisma.page.findUnique({
        where: { slug: "terms" }
    });

    return {
        title: page?.seoTitle || "Terms of Service",
        description: page?.seoDescription || "Terms and conditions.",
    };
}

async function TermsContent() {
    await connection();
    const page = await prisma.page.findUnique({
        where: { slug: "terms" }
    });

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Content not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <h1 className="text-4xl md:text-5xl font-serif mb-12 text-center">{page.title}</h1>
            <div
                className="prose prose-lg mx-auto prose-headings:font-serif prose-p:text-gray-600"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    );
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Suspense fallback={<div className="h-[50vh] flex items-center justify-center">Loading...</div>}>
                <TermsContent />
            </Suspense>
        </div>
    );
}
