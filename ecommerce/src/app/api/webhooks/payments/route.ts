import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MarketingService } from "@/services/marketing-service";
import { notificationManager } from "@/lib/notification-manager";

/**
 * Webhook handler to activate promo codes after payment.
 * @since 2026
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // In a real scenario, we would verify the payment provider signature here.
    // metadata should contain the promoId
    const { promoId, status, provider } = body;

    if (!promoId) {
      return NextResponse.json({ error: "Missing promoId" }, { status: 400 });
    }

    if (status === "SUCCESS") {
      const promo = await prisma.promoCode.findUnique({
        where: { id: Number(promoId) },
      });

      if (!promo) {
        return NextResponse.json(
          { error: "Promo code not found" },
          { status: 404 },
        );
      }

      // 1. Activate the code
      const updatedPromo = await prisma.promoCode.update({
        where: { id: promo.id },
        data: {
          status: "ACTIVE",
          isActive: true,
          updatedAt: new Date(),
        },
      });

      // 2. Trigger global price recalculation for the customer
      if (updatedPromo.ownerId) {
        await MarketingService.recalculateAccountPrices(updatedPromo.ownerId);

        // Notify user
        const userNotification = await prisma.notification.create({
          data: {
            userId: updatedPromo.ownerId,
            title: "Code Promo Activé !",
            message: `Votre code promo ${updatedPromo.code} est maintenant actif. Vos prix ont été mis à jour.`,
            type: "SUCCESS",
            link: "/dashboard/customer/promo-codes",
          },
        });
        notificationManager.notifyUser(
          String(updatedPromo.ownerId),
          userNotification,
        );

        // Notify admins
        await notificationManager.notifyAllAdmins({
          title: "Code Promo Acheté & Activé",
          message: `Le code ${updatedPromo.code} a été activé pour l'utilisateur ID: ${updatedPromo.ownerId}.`,
          type: "SUCCESS",
          link: `/admin/marketing/codes-promo`,
        });
      }

      console.log(
        `Promo code ${updatedPromo.code} activated for user ${updatedPromo.ownerId} via ${provider}.`,
      );

      return NextResponse.json({
        success: true,
        message: "Code promo activé et prix recalculés.",
        code: updatedPromo.code,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Statut ${status} reçu. Aucune activation effectuée.`,
    });
  } catch (error) {
    console.error("Payment Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
