const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const expenses = await prisma.$queryRaw`SELECT id, description, isShared, paidBy FROM Expense WHERE isShared = 1`;
        console.log("Shared Expenses:", expenses);

        const join = await prisma.$queryRaw`SELECT * FROM _ExpenseToPerson`;
        console.log("Join Table (_ExpenseToPerson):", join);

        const people = await prisma.$queryRaw`SELECT id, name, role FROM Person`;
        console.log("People:", people);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
