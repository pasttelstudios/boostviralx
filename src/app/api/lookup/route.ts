import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.replace("@", "");
  const platform = (searchParams.get("platform") || "instagram").toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Usuario requerido" }, { status: 400 });
  }

  try {
    // Foto de perfil estable: social-avatars.io es excelente para Instagram/TikTok
    let avatarUrl = `https://unavatar.io/${platform}/${username}?fallback=https://ui-avatars.com/api/?name=${username}`;
    if (platform === "instagram") {
       avatarUrl = `https://social-avatars.io/instagram/${username}/pfp`;
    }

    let followersCount: string | number = "Privado o No Encontrado";

    // Estrategia de Scraping de Metadatos (OG Tags)
    try {
      if (platform === "instagram" || platform === "tiktok") {
         const targetUrl = platform === "instagram" 
            ? `https://www.instagram.com/${username}/` 
            : `https://www.tiktok.com/@${username}`;

         const pageRes = await fetch(targetUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
              'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
            },
            next: { revalidate: 3600 }
         });

         const html = await pageRes.text();
         
         // 1. Intentar buscar en el meta tag descriptivo (más fácil de encontrar)
         // Ejemplo: <meta content="123 Seguidores, 456 Seguidos..." property="og:description">
         const descriptionMatch = html.match(/content="([\d.,KMB\s]+)(?:Seguidores|Followers)/i);
         
         // 2. Intentar buscar en el JSON-LD o scripts de estado (Plan B)
         const jsonMatch = html.match(/"edge_followed_by":\s*{"count":\s*(\d+)}/) || html.match(/"followerCount":\s*(\d+)/);

         if (descriptionMatch && descriptionMatch[1]) {
            followersCount = descriptionMatch[1].trim();
         } else if (jsonMatch && jsonMatch[1]) {
            followersCount = parseInt(jsonMatch[1]).toLocaleString();
         } else {
            // Plan C: Generar un número razonable si el scraping es totalmente bloqueado 
            // pero devolviendo algo para no dejar la UI vacía
            followersCount = "-";
         }
      }
    } catch (e) {
       console.error("Scraping failed for lookup");
    }

    return NextResponse.json({
      name: username,
      followers: followersCount,
      avatar: avatarUrl
    });
  } catch (error) {
    return NextResponse.json({
       name: username,
       followers: "-",
       avatar: `https://ui-avatars.com/api/?name=${username}`
    });
  }
}
