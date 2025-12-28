const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking RecurringIncome columns...");
        const result = await prisma.$queryRaw`PRAGMA table_info(RecurringIncome);`;
        console.log("Columns:", result);

        console.log("Checking Select...");
        const select = await prisma.$queryRaw`SELECT * FROM RecurringIncome LIMIT 1`;
        console.log("Select result:", select);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
