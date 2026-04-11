"use server";

import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1492331911870287935/St4uU1BQB2YJiRiDpxM1S2fRsWNqqApNACnE2GccJfqTQ-jzOzIuBkdnvGf69gWHLvlv";

async function sendDiscordAlert(title: string, description: string, color: number) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title,
          description,
          color,
          timestamp: new Date().toISOString(),
          footer: { text: "Sistema de Soporte BoostViralX" }
        }]
      })
    });
  } catch (err) {
    console.error("Error sending discord webhook:", err);
  }
}

export async function createTicketAction(subject: string, initialMessage: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user?.email! } });
    if (!user) return { error: "Usuario no encontrado" };

    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        subject,
        messages: {
          create: {
            senderId: user.id,
            senderName: user.name || user.email,
            text: initialMessage
          }
        }
      }
    });

    await sendDiscordAlert(
      "🆕 Nuevo Ticket Abierto",
      `**Usuario:** ${user.name} (${user.email})\n**Asunto:** ${subject}\n**Mensaje:** ${initialMessage}\n[Ver en el panel admin](https://boostviralx.com/dashboard/admin/tickets)`,
      3447003 // Blue
    );

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    return { error: "Error creando ticket" };
  }
}

export async function sendMessageAction(ticketId: string, text: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "No autorizado" };

  try {
    const email = session.user?.email!;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Usuario no encontrado" };

    // Detectar si es el agente de soporte especial
    const isSpecialSupport = email === "pasttelshop2@gmail.com";
    const senderName = isSpecialSupport ? "Soporte BoostViralX" : (user.name || user.email);

    await prisma.message.create({
      data: {
        ticketId,
        senderId: user.id,
        senderName,
        text
      }
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() }
    });

    return { success: true };
  } catch (error) {
    return { error: "Error enviando mensaje" };
  }
}

export async function updateTicketStatusAction(ticketId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") return { error: "Solo admins" };

  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
      include: { user: true }
    });

    if (status === "Resolved" || status === "Canceled") {
        await sendDiscordAlert(
            `📦 Ticket ${status}`,
            `**Ticket ID:** ${ticketId}\n**Usuario:** ${ticket.user.name}\n**Asunto:** ${ticket.subject}\nEstado actualizado a: **${status}**`,
            status === "Resolved" ? 3066993 : 15158332 // Green / Red
        );
    }

    return { success: true };
  } catch (error) {
    return { error: "Error actualizando estado" };
  }
}

export async function getTicketsAction() {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "No autorizado" };
    
    try {
        const user = await prisma.user.findUnique({ where: { email: session.user?.email! } });
        if (!user) return { error: "Usuario no encontrado" };

        const tickets = await prisma.ticket.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });
        return { tickets };
    } catch (error) {
        return { error: "Error obteniendo tickets" };
    }
}

export async function getAllTicketsAction() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") return { error: "Solo admins" };

    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { updatedAt: 'desc' },
            include: { 
                user: true,
                messages: { orderBy: { createdAt: 'asc' } } 
            }
        });
        return { tickets };
    } catch (error) {
        return { error: "Error obteniendo todos los tickets" };
    }
}
