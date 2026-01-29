import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const formats = [
        {
            name: 'A4 Landscape',
            slug: 'a4-landscape',
            widthCm: 29.7,
            heightCm: 21.0,
        },
        {
            name: 'A4 Portrait',
            slug: 'a4-portrait',
            widthCm: 21.0,
            heightCm: 29.7,
        },
        {
            name: 'Square Small (20x20)',
            slug: 'square-20',
            widthCm: 20.0,
            heightCm: 20.0,
        },
        {
            name: 'Square Large (30x30)',
            slug: 'square-30',
            widthCm: 30.0,
            heightCm: 30.0,
        },
    ];

    for (const format of formats) {
        await prisma.albumFormat.upsert({
            where: { slug: format.slug },
            update: {},
            create: format,
        });
    }

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
