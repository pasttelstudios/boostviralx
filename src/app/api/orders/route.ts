import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Acceso denegado. Se requiere autenticación." }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Usuario no reconocido por el sistema." }, { status: 404 });

    const orders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    const activeOrders = orders.filter(o => 
       o.top4smmOrderId && 
       o.top4smmOrderId !== "SYSTEM" && 
       o.top4smmOrderId !== "SYSTEM_BAL" &&
       !["Completed", "Canceled", "Partial"].includes(o.status)
    );

    if (activeOrders.length > 0) {
       const apiKey = process.env.TOP4SMM_API_KEY;
       const orderIds = activeOrders.map(o => o.top4smmOrderId).join(",");
       
       // Consultar estado en el centro de procesamiento
       const queryParams = new URLSearchParams({
          key: apiKey || "",
          action: "status",
          orders: orderIds
       });

       const syncReq = await fetch(`https://top4smm.com/api.php?${queryParams.toString()}`, {
          cache: "no-store"
       });

       const syncData = await syncReq.json();

       if (!syncData.error) {
          for (let activeDbOrder of activeOrders) {
             const realData = syncData[activeDbOrder.top4smmOrderId as string];
             if (realData && realData.status) {
                 const newStatus = realData.status; 
                 
                 if (newStatus !== activeDbOrder.status) {
                    await prisma.$transaction(async (tx) => {
                       await tx.order.update({
                           where: { id: activeDbOrder.id },
                           data: { status: newStatus }
                       });

                       if (newStatus === "Canceled") {
                          await tx.user.update({
                             where: { id: user.id },
                             data: { balance: { increment: activeDbOrder.charge } }
                          });
                       } else if (newStatus === "Partial") {
                          const remains = Number(realData.remains) || 0;
                          const totalQ = activeDbOrder.quantity;
                          if (remains > 0 && totalQ > 0) {
                             const refundRatio = remains / totalQ;
                             const refundAmount = activeDbOrder.charge * refundRatio;
                             await tx.user.update({
                                where: { id: user.id },
                                data: { balance: { increment: refundAmount } }
                             });
                          }
                       }
                    });
                 }
             }
          }
       }
    }

    const finalOrders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(finalOrders);
  } catch (error) {
    console.error("Orders sync failure:", error);
    return NextResponse.json({ error: "Error de sincronización al cargar el historial de envíos." }, { status: 500 });
  }
}
