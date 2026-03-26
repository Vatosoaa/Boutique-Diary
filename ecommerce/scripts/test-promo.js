const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const shopCodes = await prisma.promoCode.findMany({
    where: { ownerId: null },
  });
  console.log(`Found ${shopCodes.length} shop codes.`);
  shopCodes.forEach(p => {
    console.log(
      `Code: ${p.code}, costPoints: ${p.costPoints}, costMoney: ${p.costMoney}`,
    );
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
