import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  let isVip = false;
  if (session && session.user?.email) {
     const user = await prisma.user.findUnique({ where: { email: session.user.email } });
     if (user?.isVip) isVip = true;
  }

  const apiKey = process.env.TOP4SMM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Configuración del sistema incompleta." }, { status: 500 });
  }

  try {
    const res = await fetch(`https://top4smm.com/api.php?key=${apiKey}&act=services`, {
      cache: "no-store"
    });
    
    if (!res.ok) {
      throw new Error("Fallo en la conexión con el servidor de servicios.");
    }

    const data = await res.json();
    
    if (!Array.isArray(data)) {
       console.error("Unexpected response format:", data);
       return NextResponse.json({ error: "El centro de procesamiento devolvió un formato incompatible." }, { status: 500 });
    }

    // Parse data y aplicar +20% a cada rate
    const services = data.map((item: any) => {
      const multiplier = isVip ? 1.00 : 1.20;
      const newRate = (parseFloat(item.rate) * multiplier).toFixed(4);
      
      let network = "Other";
      const catUpper = (item.category || "").toUpperCase();
      const nameUpper = (item.name || "").toUpperCase();
      const searchStr = catUpper + " " + nameUpper;

      if (searchStr.includes("INSTAGRAM") || searchStr.includes("IG ")) network = "Instagram";
      else if (searchStr.includes("YOUTUBE") || searchStr.includes("YT ")) network = "YouTube";
      else if (searchStr.includes("TIKTOK")) network = "TikTok";
      else if (searchStr.includes("FACEBOOK") || searchStr.includes("FB ")) network = "Facebook";
      else if (searchStr.includes("TWITTER") || searchStr.includes(" X") || searchStr.includes("X ")) network = "Twitter";
      else if (searchStr.includes("TWITCH")) network = "Twitch";
      else if (searchStr.includes("TELEGRAM")) network = "Telegram";
      else if (searchStr.includes("SPOTIFY")) network = "Spotify";
      else if (searchStr.includes("SOUNDCLOUD")) network = "Soundcloud";
      else if (searchStr.includes("REDDIT")) network = "Reddit";
      else if (searchStr.includes("LINKEDIN")) network = "LinkedIn";
      else if (searchStr.includes("KICK")) network = "Kick";
      
      return {
        ...item,
        id: item.id || item.service, 
        rate: newRate,
        network
      };
    });

    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Fetch Exception:", error);
    return NextResponse.json({ error: "No se pudieron sincronizar los servicios disponibles." }, { status: 500 });
  }
}
