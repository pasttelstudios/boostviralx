import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const isAdmin = user.role === "ADMIN";
    
    // Obtener órdenes (los ADMINS ven todas para monitorear, los usuarios las suyas)
    // Pero por petición de privacidad normal, si eres admin verás todas? O solo las tuyas? 
    // Vamos a traer las del usuario actual.
    // También el usuario quería un historial "donde saliera mis pedidos"
    const orders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    // Filtramos las órdenes que están vivas y tienen ID de top4smm (ignora las de SYSTEM)
    // Estados típicos SMM: Pending, Processing, In progress. 
    // Finales: Completed, Partial, Canceled.
    const activeOrders = orders.filter(o => 
       o.top4smmOrderId && 
       o.top4smmOrderId !== "SYSTEM" && 
       o.top4smmOrderId !== "SYSTEM_BAL" &&
       !["Completed", "Canceled", "Partial"].includes(o.status)
    );

    if (activeOrders.length > 0) {
       const apiKey = process.env.TOP4SMM_API_KEY;
       const orderIds = activeOrders.map(o => o.top4smmOrderId).join(",");
       
       // Consultar en vivo a la API oficial (Multi-status action=status&orders=ID,ID)
       // NOTA SMM API STANDARD: action=status&orders=ID1,ID2
       const top4AuthReq = await fetch("https://top4smm.com/api.php", {
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
             key: apiKey || "",
             action: "status",
             orders: orderIds
          }).toString()
       });

       const top4smmData = await top4AuthReq.json();

       // Si hay respuestas, analizarlas y actualizar en el servidor (SYNC ON READ)
       if (!top4smmData.error) {
          for (let activeDbOrder of activeOrders) {
             const realData = top4smmData[activeDbOrder.top4smmOrderId as string];
             if (realData && realData.status) {
                 const newStatus = realData.status; // "Completed", "Processing", etc.
                 
                 // Si hubo un cambio de estado con respecto a nuestra base de datos
                 if (newStatus !== activeDbOrder.status) {
                    await prisma.$transaction(async (tx) => {
                       // Actualizar orden
                       await tx.order.update({
                           where: { id: activeDbOrder.id },
                           data: { status: newStatus }
                       });

                       // Mecanismo de Reembolso Automático Cripto-seguro
                       if (newStatus === "Canceled") {
                          // Devolver el 100% de lo que el cliente pagó
                          await tx.user.update({
                             where: { id: user.id },
                             data: { balance: { increment: activeDbOrder.charge } }
                          });
                       } else if (newStatus === "Partial") {
                          // Devolver proporcionalmente según "remains"
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

    // Retraer las órdenes completamente actualizadas de la base de datos y mapearlas para la UI
    const finalOrders = await prisma.order.findMany({
       where: { userId: user.id },
       orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(finalOrders);
  } catch (error) {
    return NextResponse.json({ error: "Error interno cargando órdenes" }, { status: 500 });
  }
}
