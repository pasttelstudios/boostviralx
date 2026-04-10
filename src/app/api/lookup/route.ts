import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const platform = searchParams.get("platform") || "instagram";

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    // Intentamos obtener la imagen usando un proxy más estable o scraping básico
    // Unavatar es bueno, pero a veces el cliente tiene bloqueos de CORS o rate-limit
    // Al hacerlo desde el servidor, evitamos el CORS.
    
    let avatarUrl = `https://unavatar.io/${platform}/${username}`;
    
    // Fallback: Si es instagram, podemos intentar una URL de proxy común en paneles SMM
    if (platform === "instagram") {
       // Muchos paneles usan servidores de caché de imágenes
       // Como no tenemos uno propio, usamos unavatar pero con un cache-buster
       avatarUrl = `https://unavatar.io/instagram/${username}?fallback=https://ui-avatars.com/api/?name=${username}`;
    }

    // Simulamos la obtención de seguidores de forma más "real"
    // En un entorno de producción, aquí se usaría un RapidAPI de Instagram o similar
    const followersCount = Math.floor(Math.random() * 25000) + 1200;

    return NextResponse.json({
      name: username,
      followers: followersCount.toLocaleString(),
      avatar: avatarUrl
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
