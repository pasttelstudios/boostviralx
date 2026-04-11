"use server";

import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import bcrypt from "bcryptjs";

export async function searchUserAction(emailQuery: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "No autorizado" };

  try {
    const users = await prisma.user.findMany({
      where: { email: { contains: emailQuery } },
      select: { 
         id: true, name: true, email: true, balance: true, role: true, isVip: true,
         orders: {
            orderBy: { createdAt: 'desc' },
            take: 100
         }
      }
    });

    const enrichedUsers = users.map(user => {
       const totalDeposited = user.orders
          .filter(o => o.top4smmOrderId === "SYSTEM_BAL" && (o.charge || 0) > 0)
          .reduce((sum, o) => sum + (o.charge || 0), 0);
       
       return { ...user, totalDeposited };
    });

    return { users: enrichedUsers };
  } catch (error) {
    return { error: "Error buscando usuarios" };
  }
}

export async function toggleVipAction(email: string, isVip: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "No autorizado" };

  try {
    const updated = await prisma.user.update({
      where: { email },
      data: { isVip }
    });
    return { success: true, isVip: updated.isVip };
  } catch (error) {
    return { error: "Error actualizando estado VIP" };
  }
}

export async function updateBalanceAction(email: string, amount: number) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "No autorizado" };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Usuario no encontrado" };

    const transaction = await prisma.$transaction(async (tx) => {
       const updated = await tx.user.update({
         where: { email },
         data: { balance: { increment: amount } }
       });

       // Registrar en el historial de Pedidos como "Balance TopUp"
       await tx.order.create({
         data: {
            userId: user.id,
            serviceId: "SYSTEM",
            serviceName: amount > 0 ? "Depósito Administrativo" : "Retiro Administrativo",
            link: "-",
            quantity: 1,
            cost: amount,
            charge: amount, 
            status: "Completed",
            top4smmOrderId: "SYSTEM_BAL"
         }
       });
       
       return updated;
    });

    return { success: true, balance: transaction.balance };
  } catch (error) {
    return { error: "Error actualizando saldo" };
  }
}

export async function getTopUsersAction() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "No autorizado" };

  try {
    const users = await prisma.user.findMany({
      orderBy: { balance: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
        isVip: true,
        role: true,
        _count: {
          select: { orders: true }
        },
        orders: {
           where: { top4smmOrderId: "SYSTEM_BAL", charge: { gt: 0 } },
           select: { charge: true }
        }
      }
    });

    return { 
      users: users.map(u => ({
        ...u,
        orderCount: u._count.orders,
        totalDeposited: u.orders.reduce((sum, o) => sum + (o.charge || 0), 0)
      })) 
    };
  } catch (error) {
    return { error: "Error obteniendo ranking" };
  }
}

export async function resetUserPasswordAction(email: string, newPassword: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "No autorizado" };

  if (!newPassword || newPassword.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" };

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    return { success: true };
  } catch (error) {
    return { error: "Error restableciendo contraseña" };
  }
}
