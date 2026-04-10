import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawLink = searchParams.get("username") || ""; // En realidad es el link completo ahora
  const platform = (searchParams.get("platform") || "instagram").toLowerCase();

  if (!rawLink) {
    return NextResponse.json({ error: "Enlace o usuario requerido" }, { status: 400 });
  }

  // Mapeo de IDs internos de Top4SMM (Descubierto por auditoría de red)
  const PLATFORM_MAP: Record<string, string> = {
    "instagram": "3",
    "tiktok": "35",
    "facebook": "33",
    "youtube": "1",
    "twitter": "4",
    "twitch": "28",
    "telegram": "32"
  };

  const topId = PLATFORM_MAP[platform] || "3";

  try {
     // Preparamos la petición EXACTA que usa Top4SMM
     const formData = new URLSearchParams();
     formData.append("id", topId);
     formData.append("link", rawLink);

     const response = await fetch("https://top4smm.com/order/orders/quick/get_thumb_url", {
        method: "POST",
        headers: {
           "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
           "X-Requested-With": "XMLHttpRequest"
        },
        body: formData.toString()
     });

     if (!response.ok) {
        throw new Error("Top4SMM Lookup failed");
     }

     const outerData = await response.json();
     const data = outerData.result?.success;

     if (data) {
        // Normalizamos la respuesta
        let followers = "Privado";
        if (data.followerCount !== undefined) {
           followers = Number(data.followerCount).toLocaleString();
        }

        // Top4SMM devuelve avatar_base64 para Instagram y avatar (URL) para otros
        let avatar = data.avatar_base64 || data.avatar || `https://ui-avatars.com/api/?name=${data.title || "User"}`;

        return NextResponse.json({
           name: data.title || rawLink,
           followers: followers,
           avatar: avatar
        });
     }

     // Si falla la respuesta estructurada, fallback razonable
     return NextResponse.json({
        name: rawLink,
        followers: "Verificando...",
        avatar: `https://unavatar.io/${platform}/${rawLink}?fallback=https://ui-avatars.com/api/?name=${rawLink}`
     });

  } catch (error) {
    console.error("Mirror Lookup failed:", error);
    return NextResponse.json({
       name: rawLink,
       followers: "-",
       avatar: `https://ui-avatars.com/api/?name=${rawLink}`
    });
  }
}
