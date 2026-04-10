import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Acceso denegado. Se requiere autenticación." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { balance: true, isVip: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no reconocido por el sistema." }, { status: 404 });
    }

    return NextResponse.json({ 
      balance: user.balance, 
      isVip: user.isVip 
    });
  } catch (error) {
    return NextResponse.json({ error: "Error de sincronización de fondos." }, { status: 500 });
  }
}
