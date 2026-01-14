import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { connection } from "next/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
    const page = await prisma.page.findUnique({
        where: { slug: "journal" }
    });

    return {
        title: page?.seoTitle || "The Journal",
        description: page?.seoDescription || "Stories, inspiration, and the art of living beautifully.",
    };
}

async function JournalContent() {
    await connection();
    const page = await prisma.page.findUnique({
        where: { slug: "journal" }
    });

    if (!page) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <p className="text-lg text-gray-500 italic">Coming soon. Stay tuned for our latest articles.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="bg-black text-white py-20 px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif">{page.title}</h1>
                <p className="mt-4 text-gray-400 max-w-lg mx-auto">{page.seoDescription}</p>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div
                    className="prose prose-lg mx-auto prose-headings:font-serif prose-p:text-gray-600 prose-img:rounded-sm"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </div>
    );
}

export default function JournalPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading journal...</div>}>
            <JournalContent />
        </Suspense>
    );
}
