const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        console.log("Last 10 expenses created:");
        expenses.forEach(e => {
            console.log(`- ${e.description}: $${e.amount} | Month: ${e.date.getMonth()} Year: ${e.date.getFullYear()} | CreatedAt: ${e.createdAt}`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
