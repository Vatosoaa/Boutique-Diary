import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { readdir } from "fs/promises";
import path from "path";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ===========================================
// CONFIGURATION
// ===========================================

const PRODUCTS_DIR = path.join(process.cwd(), "public/uploads/products");

// Estimation des prix en MGA par catégorie
const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  cartable: { min: 45000, max: 120000 },
  chaussure: { min: 80000, max: 250000 },
  "combi-short": { min: 35000, max: 80000 },
  "crop-coton": { min: 15000, max: 35000 },
  "crop-stylé": { min: 20000, max: 45000 },
  "crop-top": { min: 15000, max: 40000 },
  patalon: { min: 50000, max: 110000 },
  robe: { min: 40000, max: 90000 },
  "robe-luxe": { min: 120000, max: 350000 },
  "robe-maxi": { min: 85000, max: 180000 },
  "robe-été": { min: 35000, max: 75000 },
  sandale: { min: 25000, max: 60000 },
  short: { min: 20000, max: 50000 },
  "veste-enfant": { min: 45000, max: 95000 },
  default: { min: 30000, max: 80000 },
};

const BRANDS = [
  "Zara",
  "H&M",
  "Shein",
  "Mango",
  "Bershka",
  "Stradivarius",
  "Nike",
  "Adidas",
  "Puma",
  "Local",
];

const COLORS = [
  "Noir",
  "Blanc",
  "Rouge",
  "Bleu",
  "Vert",
  "Jaune",
  "Rose",
  "Beige",
  "Gris",
  "Gris",
  "Marron",
];

const PROMO_CATEGORIES = [
  "4 pcs beaut_ _ponge",
  "Make Up Artist Essentials",
  "Pinceaux de maquillage",
  "_eyeshadow pallette _makeup",
  "bracelet",
  "ceinture",
  "ceinture2",
  "chaussure tennis",
  "colier 4 pc",
  "fer lisseur",
  "lunnete",
  "montre",
  "rouge levre",
  "rouge levre1",
  "vernis",
  "vernis (2)",
  "vernis (3)",
];

const SIZES = ["XS", "S", "M", "L", "XL"];

const REVIEW_COMMENTS = [
  "Super qualité, je recommande !",
  "Taille très bien.",
  "La couleur est magnifique.",
  "Un peu long à la livraison, mais ça vaut le coup.",
  "Excellent rapport qualité-prix.",
  "Très confortable.",
  "Je l'adore !",
  "Conforme à la description.",
];

const CUSTOMER_NAMES = [
  "Rasoa Kely",
  "Rakoto Be",
  "Julie Randria",
  "Hery Nirina",
  "Mialy Rajo",
  "Soa Faniry",
  "Andry Lova",
  "Tiana Soa",
  "Faly Rado",
  "Nomena Fitia",
];

// ===========================================
// HELPERS
// ===========================================

const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomSubset = <T>(arr: T[], min = 1, max = 3): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randomInt(min, max));
};

function generateReference(brand: string, id: number): string {
  return `${brand.substring(0, 3).toUpperCase()}-${id.toString().padStart(4, "0")}`;
}

async function getCategoriesAndImages() {
  const categories = [];
  try {
    const items = await readdir(PRODUCTS_DIR, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const catName = item.name;
        const catPath = path.join(PRODUCTS_DIR, catName);
        const files = await readdir(catPath);
        const images = files
          .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
          .map((f) => `/uploads/products/${catName}/${f}`);

        if (images.length > 0) {
          categories.push({
            name:
              catName.charAt(0).toUpperCase() +
              catName.slice(1).replace("-", " "),
            slug: catName,
            folder: catName,
            images,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error reading products directory:", error);
  }
  return categories;
}

// ===========================================
// MAIN
// ===========================================

async function main() {
  console.log("🚀 Starting seeding (Multi-Image Mode)...");

  // Clean DB
  console.log("Cleaning database...");
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({
    where: { NOT: { email: "admin@boutique.com" } },
  });

  const catData = await getCategoriesAndImages();
  if (catData.length === 0) {
    console.error("❌ No images found in public/uploads/products/");
    return;
  }

  // Admin & User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  // Upsert Admin
  const admin = await prisma.admin.upsert({
    where: { email: "admin@boutique.com" },
    update: {},
    create: {
      name: "Admin Principal",
      email: "admin@boutique.com",
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    },
  });
  console.log("👤 Admin created/updated.");

  // Create Users
  const users = [];
  for (const name of CUSTOMER_NAMES) {
    const email = `${name.toLowerCase().replace(/\s/g, ".")}@gmail.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        username: name,
        email,
        password: clientPassword,
        role: "CUSTOMER",
        points: randomInt(0, 500),
      },
    });
    users.push(user);
  }
  console.log(`👥 ${users.length} users created.`);

  // Create Categories & Products
  let productCount = 0;
  const allProducts = [];

  for (const cat of catData) {
    // Create/Update Category
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: `Collection ${cat.name}`,
      },
    });

    const priceRange = PRICE_RANGES[cat.folder] || PRICE_RANGES.default;

    // Group images into random chunks of 4-6
    const shuffledImages = cat.images.sort(() => 0.5 - Math.random());
    const imageChunks = [];
    let i = 0;
    while (i < shuffledImages.length) {
      const chunkSize = randomInt(4, 6);
      imageChunks.push(shuffledImages.slice(i, i + chunkSize));
      i += chunkSize;
    }

    // Create a product for EACH chunk
    for (const chunk of imageChunks) {
      if (chunk.length === 0) continue;

      const isPromo = PROMO_CATEGORIES.includes(cat.folder);

      const brand = random(BRANDS);
      // Logic for Promo vs Normal
      let price;
      if (isPromo) {
        price = randomInt(5000, 25000); // Cheap for promo
      } else {
        price = randomInt(priceRange.min, priceRange.max);
      }
      const finalPrice = Math.ceil(price / 100) * 100;

      // Assign 2-3 random colors to this product
      const productColors = randomSubset(COLORS, 2, 4);

      const pName = `${cat.name} ${brand} ${random(["Collection", "Style", "Mode"])}`;
      const mainRef = generateReference(brand, productCount);

      const imagesData = chunk.map((imgPath, idx) => {
        const color = productColors[idx % productColors.length];
        return {
          url: imgPath,
          reference: `${mainRef}-${idx + 1}`,
          stock: isPromo ? randomInt(50, 150) : randomInt(2, 20), // High stock for promo
          price: finalPrice,
          color: color,
        };
      });

      const product = await prisma.product.create({
        data: {
          name: pName,
          description: isPromo
            ? `🔥 PROMOTION SPÉCIALE ! Profitez de ce superbe ${pName} à prix cassé. Stock important disponible !`
            : `Superbe ${pName}. Disponible en plusieurs couleurs.`,
          price: finalPrice,
          brand,
          reference: mainRef,
          status: "PUBLISHED",
          categoryId: category.id,
          stock: imagesData.reduce((acc, img) => acc + img.stock, 0),
          colors: productColors,
          sizes: randomSubset(SIZES, 3, 5),
          isNew: Math.random() > 0.6,
          isPromotion: isPromo ? true : Math.random() > 0.8, // Force true if promo category
          isBestSeller: Math.random() > 0.8,
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
          reviewCount: randomInt(0, 50),
          images: {
            create: imagesData,
          },
        },
      });
      allProducts.push(product);
      productCount++;
    }
  }

  console.log(
    `📦 Created ${productCount} products across ${catData.length} categories.`,
  );

  // Create Stock Movements
  for (const prod of allProducts) {
    await prisma.stockMovement.create({
      data: {
        productId: prod.id,
        type: "RECEIVED",
        quantity: prod.stock,
        previousStock: 0,
        newStock: prod.stock,
        reason: "Stock initial",
        createdBy: admin.email,
      },
    });
  }

  // Create Fake Orders
  console.log("🛒 Creating fake orders...");
  for (let i = 0; i < 50; i++) {
    const user = random(users);
    const numItems = randomInt(1, 3);
    const orderItems = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const prod = random(allProducts);
      const qty = randomInt(1, 2);
      orderItems.push({
        productId: prod.id,
        quantity: qty,
        price: prod.price,
      });
      total += prod.price * qty;
    }

    const monthOffset = randomInt(0, 11);
    const orderDate = new Date();
    orderDate.setMonth(orderDate.getMonth() - monthOffset);
    orderDate.setDate(randomInt(1, 28));

    await prisma.order.create({
      data: {
        reference: `CMD-${orderDate.getFullYear()}${(orderDate.getMonth() + 1).toString().padStart(2, "0")}-${randomInt(1000, 9999)}`,
        total,
        status: random([
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "COMPLETED",
          "CANCELLED",
        ]),
        customerId: user.id,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: {
          create: orderItems,
        },
        transactions: {
          create: {
            amount: total,
            currency: "MGA",
            provider: random(["mvola", "stripe", "cash"]),
            status: "SUCCESS",
          },
        },
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(JSON.stringify(e, null, 2));
    if (e.message) console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
