import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const platform = (searchParams.get("platform") || "instagram").toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Usuario requerido" }, { status: 400 });
  }

  try {
    // Foto de perfil: unavatar.io es la apuesta más segura y rápida por ahora
    const avatarUrl = `https://unavatar.io/${platform}/${username}?fallback=https://ui-avatars.com/api/?name=${username}`;
    
    // Obtención de seguidores (Lógica de scraping de metadatos robusta)
    let followersCount: string | number = "Desconocido";

    try {
      if (platform === "instagram") {
        // Intentamos obtener el conteo de la página pública de Instagram
        const igRes = await fetch(`https://www.instagram.com/${username}/`, {
           headers: {
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
           },
           next: { revalidate: 3600 }
        });
        const html = await igRes.text();
        
        // Buscamos el patrón de seguidores en el JSON de la página o en el meta tag
        const match = html.match(/"edge_followed_by":\s*{"count":\s*(\d+)}/);
        const metaMatch = html.match(/(\d+)\s+Followers/i);

        if (match && match[1]) {
           followersCount = parseInt(match[1]).toLocaleString();
        } else if (metaMatch && metaMatch[1]) {
           followersCount = parseInt(metaMatch[1]).toLocaleString();
        } else {
           // Fallback dinámico si el scraping es bloqueado (número verosímil pero marcado)
           followersCount = "En verificación...";
        }
      } else if (platform === "tiktok") {
         const ttRes = await fetch(`https://www.tiktok.com/@${username}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
         });
         const html = await ttRes.text();
         const match = html.match(/"followerCount":\s*(\d+)/);
         if (match && match[1]) {
            followersCount = parseInt(match[1]).toLocaleString();
         } else {
            followersCount = "En verificación...";
         }
      }
    } catch (scrapingError) {
       console.error("Lookup scraping block or error:", platform);
       followersCount = "Privado o No Encontrado";
    }

    return NextResponse.json({
      name: username,
      followers: followersCount,
      avatar: avatarUrl
    });
  } catch (error) {
    console.error("Lookup absolute failure:", error);
    return NextResponse.json({
       name: username,
       followers: "Error de carga",
       avatar: `https://ui-avatars.com/api/?name=${username}`
    });
  }
}
