import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await verifyToken();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    if (!templateId) {
      return NextResponse.json(
        { error: "ID du code promo manquant" },
        { status: 400 },
      );
    }

    // 1. Fetch the template code
    const templateCode = await prisma.promoCode.findUnique({
      where: { id: templateId },
    });

    if (!templateCode || !templateCode.isActive) {
      return NextResponse.json(
        { error: "Ce code promo n'est pas disponible" },
        { status: 400 },
      );
    }

    // 2. Create a unique code for the user
    const newCodeString = `MY-${templateCode.code}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 3. Create new PENDING code owned by user
    const newPromo = await prisma.promoCode.create({
      data: {
        code: newCodeString,
        type: templateCode.type,
        value: templateCode.value,
        minOrderAmount: templateCode.minOrderAmount,
        usageLimit: 1,
        ownerId: user.userId,
        status: "PENDING",
        costMoney: templateCode.costMoney,
        isActive: false, // Inactive until payment webhook
      },
    });

    return NextResponse.json({
      success: true,
      promoId: newPromo.id,
      code: newPromo.code,
    });
  } catch (error) {
    console.error("Purchase Init Error:", error);
    return NextResponse.json(
      { error: "Erreur d'initialisation de l'achat" },
      { status: 500 },
    );
  }
}
