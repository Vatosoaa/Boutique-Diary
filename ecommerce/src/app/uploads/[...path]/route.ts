import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

/**
 * Route fallback pour servir les images uploadées en temps réel
 * même en mode production ('next start').
 * Next.js statique ne voit pas les nouveaux fichiers dans 'public/'
 * après le démarrage du serveur, cette route dynamique prend donc le relais.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  // Récupérer le chemin dynamique (ex: /uploads/produit.jpg -> params.path = ["produit.jpg"])
  const { path: pathSegments } = await context.params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    ...pathSegments,
  );

  // Vérification de sécurité pour éviter les traversées de répertoire
  if (!filePath.startsWith(path.join(process.cwd(), "public", "uploads"))) {
    return new NextResponse("Accès refusé", { status: 403 });
  }

  if (!existsSync(filePath)) {
    return new NextResponse("Image non trouvée", { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    // Mapping des types MIME courants
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
      ".ico": "image/x-icon",
    };

    const contentType = mimeTypes[extension] || "application/octet-stream";

    // Retourne l'image avec les en-têtes appropriés
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Uploads Route fallback] Erreur de lecture :", error);
    return new NextResponse("Erreur lors de la lecture du fichier", {
      status: 500,
    });
  }
}
