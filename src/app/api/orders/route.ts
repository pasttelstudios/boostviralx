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

    // 1. Obtener órdenes locales
    let orders: any[] = [];
    try {
       orders = await prisma.order.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" }
       });
    } catch (dbError) {
       console.error("Database fetch error:", dbError);
       return NextResponse.json([]);
    }

    const activeOrders = orders.filter(o => 
       o.top4smmOrderId && 
       o.top4smmOrderId !== "SYSTEM" && 
       o.top4smmOrderId !== "SYSTEM_BAL" &&
       !["Completed", "Canceled", "Partial"].includes(o.status)
    ).slice(0, 15); // Limitado para no sobrecargar el servidor

    // 2. Sincronización Individual de Precisión (act=order_info)
    if (activeOrders.length > 0) {
       const apiKey = process.env.TOP4SMM_API_KEY;
       
       for (const activeDbOrder of activeOrders) {
          try {
             // Consultamos cada pedido individualmente para máxima precisión
             const queryParams = new URLSearchParams({
                key: apiKey || "",
                act: "order_info",
                id: activeDbOrder.top4smmOrderId || ""
             });

             const syncReq = await fetch(`https://top4smm.com/api.php?${queryParams.toString()}`, {
                cache: "no-store",
                headers: { 'Accept': 'application/json' }
             });

             if (syncReq.ok) {
                const realData = await syncReq.json();
                
                // Si la API devuelve el objeto de la orden (Top4SMM devuelve directamente el objeto)
                if (realData && realData.status) {
                    const newStatus = realData.status; 
                    const startCountVal = realData.start_count ? parseInt(realData.start_count) : (activeDbOrder.startCount || 0);
                    const remainsVal = (realData.remains !== undefined) ? parseInt(realData.remains) : (activeDbOrder.remains || 0);

                    // Solo actualizar si hay cambios reales
                    if (newStatus !== activeDbOrder.status || startCountVal !== activeDbOrder.startCount || remainsVal !== activeDbOrder.remains) {
                        await prisma.order.update({
                            where: { id: activeDbOrder.id },
                            data: { 
                               status: newStatus,
                               startCount: startCountVal,
                               remains: remainsVal
                            }
                        });
                    }
                }
             }
          } catch (itemError) {
             console.error(`Error syncing order ${activeDbOrder.top4smmOrderId}:`, itemError);
          }
       }
    }

    // 3. Respuesta final con datos actualizados
    const finalOrders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(finalOrders);
  } catch (error) {
    console.error("Critical orders API failure:", error);
    return NextResponse.json({ error: "Error de sincronización con el sistema de rastreo." }, { status: 500 });
  }
}
