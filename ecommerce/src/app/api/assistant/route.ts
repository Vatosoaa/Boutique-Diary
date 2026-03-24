import { NextResponse } from "next/server";
import { ClientAssistantService } from "@/services/ai/client-assistant-service";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const result = await ClientAssistantService.handleRequest(message, history);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Client Assistant API] ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Une erreur est survenue" },
      { status: 500 },
    );
  }
}
