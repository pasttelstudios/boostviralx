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

    // 1. Obtener órdenes locales primero (Blindaje de consulta)
    let orders: any[] = [];
    try {
       orders = await prisma.order.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" }
       });
    } catch (dbError) {
       console.error("Database fetch error in orders:", dbError);
       // Si falla la consulta a los nuevos campos, devolvemos un array vacío pero no rompemos la app
       return NextResponse.json([]);
    }

    const activeOrders = orders.filter(o => 
       o.top4smmOrderId && 
       o.top4smmOrderId !== "SYSTEM" && 
       o.top4smmOrderId !== "SYSTEM_BAL" &&
       !["Completed", "Canceled", "Partial"].includes(o.status)
    );

    // 2. Sincronización segura (Soft Update)
    if (activeOrders.length > 0) {
       try {
          const apiKey = process.env.TOP4SMM_API_KEY;
          const orderIds = activeOrders.map(o => o.top4smmOrderId).join(",");
          
          const queryParams = new URLSearchParams({
             key: apiKey || "",
             act: "status",
             orders: orderIds
          });

          // Aumentamos el timeout y manejamos la respuesta con cautela
          const syncReq = await fetch(`https://top4smm.com/api.php?${queryParams.toString()}`, {
             cache: "no-store",
             headers: { 'Accept': 'application/json' },
             next: { revalidate: 0 }
          });

          if (syncReq.ok) {
             const rawResponse = await syncReq.text();
             let syncData: any;
             try {
                syncData = JSON.parse(rawResponse);
             } catch (e) {
                console.error("Order sync parse failure (Non-JSON)");
             }

             if (syncData && !syncData.error) {
                for (let activeDbOrder of activeOrders) {
                   const realData = syncData[activeDbOrder.top4smmOrderId as string];
                   if (realData && realData.status) {
                       const newStatus = realData.status; 
                       // Aseguramos que los valores sean números antes de guardar
                       const startCountVal = realData.start_count ? parseInt(realData.start_count) : (activeDbOrder.startCount || 0);
                       const remainsVal = realData.remains ? parseInt(realData.remains) : (activeDbOrder.remains || 0);
                       
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
                                const rCount = parseInt(realData.remains) || 0;
                                const totalQ = activeDbOrder.quantity;
                                if (rCount > 0 && totalQ > 0) {
                                   const refundRatio = rCount / totalQ;
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
       } catch (syncError) {
          console.error("External sync bypassed due to connection issues.");
       }
    }

    // 3. Respuesta final (Siempre devolvemos algo válido)
    const finalOrders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(finalOrders);
  } catch (error) {
    console.error("Critical failure in orders API:", error);
    // En caso de fallo crítico, devolvemos balanceado para que el front no muera
    return NextResponse.json({ error: "Temporalmente fuera de sincronía. Reintenta en breve." }, { status: 500 });
  }
}
