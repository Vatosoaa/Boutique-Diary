import { NextResponse } from "next/server";
import { AdminAssistantService } from "@/services/ai/admin-assistant-service";
import { verifyAdminToken } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    // 1. Check Auth (Admin only)
    const admin = await verifyAdminToken();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { message, history } = await req.json();
    console.log("[Assistant API] Message:", message);
    console.log("[Assistant API] History count:", history?.length);

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const result = await AdminAssistantService.handleRequest(message, history);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Assistant API] ERROR DETAILS:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      response: error.response?.text
        ? error.response.text()
        : "no response text",
    });
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue" },
      { status: 500 },
    );
  }
}
