import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { email, amount } = await req.json();

    if (!email || amount <= 0) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { balance: { increment: amount } }
    });

    return NextResponse.json({ balance: updatedUser.balance.toFixed(2) });
  } catch (error) {
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
