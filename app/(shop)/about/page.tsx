import { Metadata } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { connection } from "next/server";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const page = await prisma.page.findUnique({
        where: { slug: "about" }
    });

    return {
        title: page?.seoTitle || "Our Story",
        description: page?.seoDescription || "Learn about the philosophy behind Ivy Avenue.",
    };
}

async function DynamicContent() {
    await connection();
    const page = await prisma.page.findUnique({
        where: { slug: "about" }
    });

    if (page) {
        return (
            <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-8 text-center">{page.title}</h1>
                <div
                    className="prose prose-lg mx-auto prose-headings:font-serif prose-p:text-gray-600 prose-img:rounded-sm"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </section>
        );
    }

    return <StaticFallback />;
}

function StaticFallback() {
    return (
        <>
            {/* Hero */}
            <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0 opacity-70">
                    <Image
                        src="/Hero Background.webp"
                        alt="About Ivy Avenue"
                        fill
                        className="object-cover object-center grayscale"
                        priority
                    />
                </div>
                <div className="relative z-10 text-center max-w-2xl px-6 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-6">Our Story</h1>
                    <p className="text-xl font-light tracking-wide opacity-90">
                        Refined. Monochrome. Forever.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto space-y-12 text-center md:text-left">
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif">The Philosophy</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Ivy Avenue was born from a desire to bring the timeless beauty of nature into the modern home, without the fleeting lifespan of fresh blooms. We believe that decor should be an investment—an enduring statement of style that evolves with your space.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Our collection is strictly curated. We reject the chaotic colors of the garden in favor of a refined, monochrome palette. Textures take center stage. From the velvet touch of a midnight calla lily to the crisp architecture of a white hydrangea, every stem is chosen for its sculptural quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">
                    <div className="aspect-square relative bg-gray-100">
                        <Image
                            src="/Monochrome Bouquet.webp"
                            alt="Design Process"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif">The Process</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We source only the highest quality faux botanicals, selected for their realism and tactile quality. Each arrangement is composed with the eye of an artist, balancing negative space with organic form.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading story...</div>}>
                <DynamicContent />
            </Suspense>
        </div>
    );
}
