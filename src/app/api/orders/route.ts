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

    // 1. Obtener órdenes locales primero para asegurar que siempre haya algo que mostrar
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

    // 2. Intentar sincronización con el centro de procesamiento de forma segura
    if (activeOrders.length > 0) {
       try {
          const apiKey = process.env.TOP4SMM_API_KEY;
          const orderIds = activeOrders.map(o => o.top4smmOrderId).join(",");
          
          const queryParams = new URLSearchParams({
             key: apiKey || "",
             act: "status", // Corregido de 'action' a 'act' según documentación
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
             // No lanzamos error, permitimos que el flujo continúe con los datos locales
          }

          if (syncData && !syncData.error) {
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
       } catch (syncError) {
          // Si el servidor externo está caído o no responde, 
          // simplemente logueamos el error pero NO bloqueamos la respuesta al usuario.
          console.error("Soft order sync failed:", syncError);
       }
    }

    // 3. Devolver las órdenes actualizadas (o las locales si falló la sincronización)
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
