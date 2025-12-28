const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const categories = [
        { name: 'Comida', color: '#f43f5e', icon: 'Utensils' },
        { name: 'Suscripciones', color: '#6366f1', icon: 'Tv' },
        { name: 'Transporte', color: '#f59e0b', icon: 'Car' },
        { name: 'Salidas', color: '#10b981', icon: 'GlassWater' },
        { name: 'Vivienda', color: '#8b5cf6', icon: 'Home' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }

    await prisma.expense.create({
        data: { description: 'Supermercado Coto', amount: 4500, category: 'Comida', date: new Date() }
    });

    console.log('Seed data created!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
