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

    // 1. Obtener órdenes locales primero
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

    // 2. Intentar sincronización segura
    if (activeOrders.length > 0) {
       try {
          const apiKey = process.env.TOP4SMM_API_KEY;
          const orderIds = activeOrders.map(o => o.top4smmOrderId).join(",");
          
          const queryParams = new URLSearchParams({
             key: apiKey || "",
             act: "status",
             orders: orderIds
          });

          const syncReq = await fetch(`https://top4smm.com/api.php?${queryParams.toString()}`, {
             cache: "no-store",
             headers: { 'Accept': 'application/json' }
          });

          const rawResponse = await syncReq.text();
          let syncData: any;
          try {
             syncData = JSON.parse(rawResponse);
          } catch (e) {
             console.error("Order sync parse failure:", rawResponse);
          }

          if (syncData && !syncData.error) {
             for (let activeDbOrder of activeOrders) {
                const realData = syncData[activeDbOrder.top4smmOrderId as string];
                if (realData && realData.status) {
                    const newStatus = realData.status; 
                    const startCountVal = realData.start_count ? Number(realData.start_count) : activeDbOrder.startCount;
                    const remainsVal = realData.remains ? Number(realData.remains) : activeDbOrder.remains;
                    
                    // Solo actualizamos si algo cambió
                    if (newStatus !== activeDbOrder.status || startCountVal !== activeDbOrder.startCount || remainsVal !== activeDbOrder.remains) {
                       await prisma.$transaction(async (tx) => {
                          await tx.order.update({
                              where: { id: activeDbOrder.id },
                              data: { 
                                 status: newStatus,
                                 startCount: startCountVal,
                                 remains: remainsVal
                              }
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
       } catch (syncError) {
          console.error("Soft order sync failed:", syncError);
       }
    }

    const finalOrders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(finalOrders);
  } catch (error) {
    console.error("Orders master failure:", error);
    return NextResponse.json({ error: "Error de conexión al cargar la lista de movimientos." }, { status: 500 });
  }
}
