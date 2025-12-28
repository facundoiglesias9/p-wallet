const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const expenses = await prisma.$queryRaw`SELECT description, amount, date, isShared, userId FROM Expense`;
        console.log("JSON_START");
        console.log(JSON.stringify(expenses, null, 2));
        console.log("JSON_END");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
