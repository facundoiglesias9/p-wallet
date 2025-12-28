const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Inspecting _ExpenseToPerson implicit table...");
        const result = await prisma.$queryRaw`PRAGMA table_info(_ExpenseToPerson);`;
        console.log(result);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
