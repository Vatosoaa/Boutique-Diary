import { prisma } from "../src/lib/prisma";

async function syncProductRatings() {
  console.log("Starting sync of product ratings and counts...");

  const products = await prisma.product.findMany({
    select: { id: true },
  });

  let updatedCount = 0;

  for (const product of products) {
    const aggregate = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const newRating = aggregate._avg.rating || 0;
    const newCount = aggregate._count.rating || 0;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: newRating,
        reviewCount: newCount,
      },
    });

    updatedCount++;
    if (updatedCount % 10 === 0) {
      console.log(`Processed ${updatedCount}/${products.length} products...`);
    }
  }

  console.log(`Sync complete. Updated ${updatedCount} products.`);
}

syncProductRatings()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
