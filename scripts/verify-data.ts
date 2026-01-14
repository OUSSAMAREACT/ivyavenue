
import 'dotenv/config';
import { PrismaClient } from '../lib/generated/client/client';
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.count();
    const reviews = await prisma.review.count();
    console.log(`Products: ${products}`);
    console.log(`Reviews: ${reviews}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
