import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        // 1. Cleanup (Safe delete for re-seeding dev environment)
        // In production, we might want to be more careful, but user requested a fix for "missing content"
        await prisma.review.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.image.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.user.deleteMany({ where: { email: "admin@ivyavenue.com" } });

        // 2. Create Categories
        const categoryStems = await prisma.category.create({
            data: { name: 'Individual Stems', slug: 'stems' }
        });
        const categoryBouquets = await prisma.category.create({
            data: { name: 'Bouquets', slug: 'bouquets' }
        });
        const categoryVases = await prisma.category.create({
            data: { name: 'Vases', slug: 'vases' }
        });

        // 3. Create Products
        const products = [
            {
                name: 'White Hydrangea Stem',
                slug: 'white-hydrangea-stem',
                description: 'A classic, voluminous bloom with pristine white petals. Perfect for adding texture and fullness to any arrangement. 60cm length.',
                price: 18.00,
                categoryId: categoryStems.id,
                images: ['/White Hydrangea Stem.webp']
            },
            {
                name: 'Eucalyptus Branch',
                slug: 'eucalyptus-branch',
                description: 'Elegant silver-dollar eucalyptus with realistic grey-green foliage. Adds a modern, organic touch. 80cm length.',
                price: 12.50,
                categoryId: categoryStems.id,
                images: ['/Eucalyptus Branch.webp']
            },
            {
                name: 'Black Calla Lily',
                slug: 'black-calla-lily',
                description: 'A striking, deep purple-black lily that embodies refined drama. Smooth, sculptural form. 70cm length.',
                price: 16.00,
                categoryId: categoryStems.id,
                images: ['/Black Calla Lily.webp']
            },
            {
                name: 'Velvet Red Rose',
                slug: 'velvet-red-rose',
                description: 'A single deep velvet red rose stem, high contrast against a dark background for a romantic, dramatic touch.',
                price: 15.00,
                categoryId: categoryStems.id,
                images: ['/velvet_red_rose_1768305933544.png']
            },
            {
                name: 'Dried Palm Spear',
                slug: 'dried-palm-spear',
                description: 'Natural beige dried palm spear, perfect for minimalist and bohemian arrangements. Adds texture and height.',
                price: 10.00,
                categoryId: categoryStems.id,
                images: ['/dried_palm_spear_1768305947353.png']
            },
            {
                name: 'Olive Branch Stem',
                slug: 'olive-branch-stem',
                description: 'Realistic faux olive branch with green leaves and small olives. Adds an airy, Mediterranean feel to any space.',
                price: 19.00,
                categoryId: categoryStems.id,
                images: ['/olive_branch_stem_1768305961361.png']
            },
            {
                name: 'Monochrome Bouquet',
                slug: 'monochrome-bouquet',
                description: 'A curated selection of our finest white stems and dark foliage, pre-arranged for instant elegance.',
                price: 120.00,
                categoryId: categoryBouquets.id,
                images: ['/Monochrome Bouquet.webp']
            }
        ];

        for (const p of products) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    price: p.price,
                    stock: 50,
                    categoryId: p.categoryId,
                    images: {
                        create: p.images.map(url => ({ url, alt: p.name }))
                    }
                }
            });
        }

        // 4. Create Admin User
        const hashedPassword = await bcrypt.hash('ivy2026', 10);
        await prisma.user.upsert({
            where: { email: 'admin@ivyavenue.com' },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email: 'admin@ivyavenue.com',
                password: hashedPassword,
                name: 'Ivy Admin',
                role: 'ADMIN',
            }
        });

        // 5. Create Reviews
        const stems = await prisma.product.findMany({ where: { category: { slug: 'stems' } } });
        if (stems.length > 0) {
            await prisma.review.create({
                data: {
                    rating: 5,
                    comment: "Absolutely stunning! Looks just like the real thing.",
                    name: "Sarah M.",
                    productId: stems[0].id
                }
            });
            await prisma.review.create({
                data: {
                    rating: 4,
                    comment: "Great quality, fast shipping.",
                    name: "John D.",
                    productId: stems[0].id
                }
            });
        }

        // 6. Create Default Pages
        const pages = [
            { title: "About Us", slug: "about", content: "<h1>About Ivy Avenue</h1><p>Our story...</p>" },
            { title: "Contact", slug: "contact", content: "<h1>Contact Us</h1><p>Get in touch...</p>" },
            { title: "Journal", slug: "journal", content: "<h1>The Journal</h1><p>Latest news...</p>" },
            { title: "Privacy Policy", slug: "privacy", content: "<h1>Privacy Policy</h1><p>Your privacy matters...</p>" },
            { title: "Terms of Service", slug: "terms", content: "<h1>Terms of Service</h1><p>Our terms...</p>" },
        ];

        for (const page of pages) {
            await prisma.page.upsert({
                where: { slug: page.slug },
                update: {},
                create: {
                    title: page.title,
                    slug: page.slug,
                    content: page.content,
                    isPublished: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully. Admin: admin@ivyavenue.com / ivy2026"
        });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
