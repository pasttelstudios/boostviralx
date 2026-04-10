"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Todos los campos son obligatorios" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { error: "Este correo ya está registrado" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = email.toLowerCase() === "pasttelshop2@gmail.com" ? "ADMIN" : "USER";

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole 
      }
    });

    return { success: true };
  } catch (error) {
    return { error: "Ocurrió un error al registrar" };
  }
}
