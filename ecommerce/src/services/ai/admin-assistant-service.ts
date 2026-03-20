import {
  GoogleGenerativeAI,
  Tool,
  SchemaType,
  Content,
} from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Tool definitions for Gemini
const adminTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "get_sales_performance",
        description:
          "Obtenir les performances de ventes sur une période donnée (ex: '7 derniers jours', 'mois actuel').",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            days: {
              type: SchemaType.NUMBER,
              description: "Nombre de jours passés à analyser (par défaut 7).",
            },
          },
        },
      },
      {
        name: "get_inventory_report",
        description:
          "Obtenir un rapport sur l'état des stocks, incluant les produits en rupture ou en stock faible.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            threshold: {
              type: SchemaType.NUMBER,
              description:
                "Le seuil en dessous duquel un stock est considéré comme faible (par défaut 5).",
            },
          },
        },
      },
      {
        name: "update_product_stock",
        description:
          "Mettre à jour la quantité en stock d'un produit spécifique.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productId: {
              type: SchemaType.NUMBER,
              description: "L'ID du produit.",
            },
            newStock: {
              type: SchemaType.NUMBER,
              description: "La nouvelle quantité en stock.",
            },
          },
          required: ["productId", "newStock"],
        },
      },
      {
        name: "update_product_price",
        description: "Mettre à jour le prix d'un produit.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productId: {
              type: SchemaType.NUMBER,
              description: "L'ID du produit.",
            },
            newPrice: {
              type: SchemaType.NUMBER,
              description: "Le nouveau prix.",
            },
          },
          required: ["productId", "newPrice"],
        },
      },
      {
        name: "apply_promotion",
        description: "Appliquer une promotion à un produit (baisse de prix).",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productId: {
              type: SchemaType.NUMBER,
              description: "L'ID du produit.",
            },
            discountPercentage: {
              type: SchemaType.NUMBER,
              description: "Le pourcentage de réduction.",
            },
          },
          required: ["productId", "discountPercentage"],
        },
      },
      {
        name: "search_products",
        description:
          "Rechercher des produits par nom ou référence pour obtenir leurs IDs.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: "Le nom ou la référence du produit.",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_recent_orders",
        description: "Obtenir la liste des dernières commandes.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            limit: {
              type: SchemaType.NUMBER,
              description: "Nombre de commandes à retourner (par défaut 10).",
            },
          },
        },
      },
      {
        name: "get_top_products",
        description: "Obtenir la liste des produits les plus vendus.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            limit: {
              type: SchemaType.NUMBER,
              description: "Nombre de produits à retourner (par défaut 5).",
            },
          },
        },
      },
    ],
  },
];

export class AdminAssistantService {
  private static readonly MODEL_NAME = "gemini-2.5-flash";

  static async handleRequest(message: string, history: Content[] = []) {
    const model = genAI.getGenerativeModel({
      model: this.MODEL_NAME,
      tools: adminTools,
      systemInstruction: `Vous êtes l'Assistant IA de Boutique Diary (Madagascar). 
      Votre rôle est d'aider l'administrateur à gérer la boutique, faire des rapports et exécuter des actions sur les produits.
      Vous avez accès à des outils pour lire et modifier les données.
      Répondez de manière professionnelle, concise et en français.`,
    });

    // Clean history: Gemini is strict about roles
    // 1. Must start with 'user'
    // 2. Roles must alternate
    const cleanedHistory: Content[] = (history || []).map((h) => {
      const isFunctionRole = h.role === "function";
      return {
        role: h.role === "system" ? "user" : h.role,
        parts: h.parts.map((p) => {
          if (p.functionCall) return { functionCall: p.functionCall };
          if (p.functionResponse)
            return { functionResponse: p.functionResponse };

          // Default to text part, ensuring at least one part exists
          return { text: p.text || (isFunctionRole ? "" : " ") };
        }),
      };
    });
    // Start index for history to ensure it starts with 'user'
    let startIndex = 0;
    while (
      startIndex < cleanedHistory.length &&
      cleanedHistory[startIndex].role === "model"
    ) {
      startIndex++;
    }

    const chat = model.startChat({
      history: cleanedHistory.slice(startIndex),
    });

    try {
      let result = await chat.sendMessage(message);
      let response = result.response;

      // Handle tool calls
      const calls = response.functionCalls();
      if (calls && calls.length > 0) {
        const toolResponses = [];

        for (const call of calls) {
          const { name, args } = call;
          const toolArgs = args as Record<string, string | number | undefined>;
          console.log(`[AdminAI] Calling tool: ${name}`, toolArgs);

          let toolResult;
          switch (name) {
            case "get_sales_performance":
              toolResult = await this.getSalesPerformance(
                Number(toolArgs.days) || 7,
              );
              break;
            case "get_inventory_report":
              toolResult = await this.getInventoryReport(
                Number(toolArgs.threshold) || 5,
              );
              break;
            case "update_product_stock":
              toolResult = await this.updateProductStock(
                Number(toolArgs.productId),
                Number(toolArgs.newStock),
              );
              break;
            case "update_product_price":
              toolResult = await this.updateProductPrice(
                Number(toolArgs.productId),
                Number(toolArgs.newPrice),
              );
              break;
            case "apply_promotion":
              toolResult = await this.applyPromotion(
                Number(toolArgs.productId),
                Number(toolArgs.discountPercentage),
              );
              break;
            case "search_products":
              toolResult = await this.searchProducts(String(toolArgs.query));
              break;
            case "get_recent_orders":
              toolResult = await this.getRecentOrders(
                Number(toolArgs.limit) || 10,
              );
              break;
            case "get_top_products":
              toolResult = await this.getTopProducts(
                Number(toolArgs.limit) || 5,
              );
              break;
            default:
              toolResult = { error: "Outil non trouvé" };
          }

          toolResponses.push({
            functionResponse: {
              name,
              response: toolResult,
            },
          });
        }

        console.log(
          `[AdminAI] Sending ${toolResponses.length} tool responses back...`,
        );
        result = await chat.sendMessage(toolResponses);
        response = result.response;
      }

      const responseText = response.text();
      console.log("[AdminAI] Final response text:", responseText);

      return {
        text: responseText,
        history: await chat.getHistory(),
      };
    } catch (error) {
      console.error("[AdminAI] Error:", error);
      throw error;
    }
  }

  // --- Tool Implementations ---

  private static async getSalesPerformance(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;

    return {
      periodInDays: days,
      totalRevenue,
      orderCount,
      averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
    };
  }

  private static async getInventoryReport(threshold: number) {
    const products = await prisma.product.findMany({
      where: {
        stock: { lte: threshold },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        reference: true,
        stock: true,
        price: true,
      },
    });

    return {
      threshold,
      productsFound: products.length,
      products,
    };
  }

  private static async updateProductStock(productId: number, newStock: number) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      // Record movement
      await prisma.stockMovement.create({
        data: {
          productId,
          quantity: newStock,
          previousStock: 0, // Simplified
          newStock: newStock,
          type: "IN",
          reason: "Mis à jour via AI Assistant",
        },
      });

      return {
        success: true,
        productName: product.name,
        newStock: product.stock,
      };
    } catch {
      return {
        success: false,
        error: "Produit non trouvé ou erreur de mise à jour",
      };
    }
  }

  private static async updateProductPrice(productId: number, newPrice: number) {
    try {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { price: newPrice },
      });
      return {
        success: true,
        productName: product.name,
        newPrice: product.price,
      };
    } catch {
      return { success: false, error: "Erreur de mise à jour" };
    }
  }

  private static async applyPromotion(
    productId: number,
    discountPercentage: number,
  ) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) return { error: "Produit non trouvé" };

      const oldPrice = product.price;
      const newPrice = oldPrice * (1 - discountPercentage / 100);

      const updated = await prisma.product.update({
        where: { id: productId },
        data: {
          isPromotion: true,
          oldPrice: oldPrice,
          price: newPrice,
        },
      });

      return {
        success: true,
        productName: updated.name,
        oldPrice,
        newPrice: updated.price,
        discount: `${discountPercentage}%`,
      };
    } catch {
      return { success: false, error: "Erreur" };
    }
  }

  private static async searchProducts(query: string) {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { reference: { contains: query, mode: "insensitive" } },
        ],
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        reference: true,
        stock: true,
        price: true,
      },
      take: 10,
    });
    return { query, count: products.length, products };
  }

  private static async getRecentOrders(limit: number) {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        customer: {
          select: {
            username: true,
            email: true,
          },
        },
        total: true,
        status: true,
        createdAt: true,
      },
    });
    return { limit, orders };
  }

  private static async getTopProducts(limit: number) {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const products = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { id: true, name: true, price: true, reference: true },
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
        };
      }),
    );

    return { limit, products };
  }
}
