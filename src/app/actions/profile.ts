"use server";

import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import bcrypt from "bcryptjs";

export async function updateProfileNameAction(newName: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  try {
    await prisma.user.update({
      where: { email: session.user?.email! },
      data: { name: newName }
    });
    return { success: true };
  } catch (error) {
    return { error: "Error actualizando nombre" };
  }
}

export async function updateProfilePasswordAction(currentPass: string, newPass: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  const email = session.user?.email!;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Usuario no encontrado" };

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) return { error: "La contraseña actual es incorrecta" };

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    return { error: "Error actualizando contraseña" };
  }
}
