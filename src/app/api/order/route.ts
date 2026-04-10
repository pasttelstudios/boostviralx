import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
  }

  try {
    const { serviceId, link, quantity } = await req.json();

    if (!serviceId || !link || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Información de solicitud incompleta. Por favor, revisa los campos." }, { status: 400 });
    }

    // 1. Obtener listado sagrado de precios oficial
    const apiKey = process.env.TOP4SMM_API_KEY;
    const fetchServices = await fetch(`https://top4smm.com/api.php?key=${apiKey}&act=services`, { cache: "no-store" });
    const services = await fetchServices.json();

    if (!Array.isArray(services)) {
       return NextResponse.json({ error: "Incapacidad temporal para conectar con el centro de procesamiento." }, { status: 500 });
    }

    const officialService = services.find((s: any) => String(s.id) === String(serviceId));
    if (!officialService) {
       return NextResponse.json({ error: "El servicio seleccionado se encuentra en mantenimiento técnico o no está disponible." }, { status: 400 });
    }

    // 2. Validación CRÍTICA de Mínimos/Máximos
    const minOrder = Number(officialService.min_order || officialService.min);
    const maxOrder = Number(officialService.max_order || officialService.max);

    if (quantity < minOrder || quantity > maxOrder) {
       return NextResponse.json({ error: `La cantidad solicitada debe estar entre ${minOrder} y ${maxOrder}` }, { status: 400 });
    }

    // 4. Bloqueo de Seguridad en Base de datos
    const userDb = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!userDb) {
      return NextResponse.json({ error: "Datos de usuario no encontrados." }, { status: 404 });
    }

    // 3. Cálculos matemáticos Inalterables
    const officialRate = parseFloat(officialService.rate);
    const boostRate = userDb.isVip ? officialRate : (officialRate * 1.20);
    const totalToCharge = (boostRate / 1000) * quantity;

    if (userDb.balance < totalToCharge) {
      return NextResponse.json({ error: `Fondos insuficientes para procesar esta solicitud. Requieres $${totalToCharge.toFixed(2)} y dispones de $${userDb.balance.toFixed(2)}` }, { status: 402 });
    }

    // 5. Transacción Nuclear
    const transaction = await prisma.$transaction(async (tx) => {
        // A) Restar y cobrar al cliente
        const updatedUser = await tx.user.update({
            where: { email: userDb.email },
            data: { balance: { decrement: totalToCharge } }
        });

        // B) Registrar el pedido interno
        const order = await tx.order.create({
            data: {
                userId: userDb.id,
                serviceId: serviceId.toString(),
                serviceName: officialService.name,
                link: link,
                quantity: quantity,
                charge: totalToCharge,
                cost: (officialRate / 1000) * quantity,
                status: "Pending"
            }
        });

        // C) Ejecutar la sincronización con el centro de procesamiento
        // Usamos GET con parámetros de consulta según la documentación oficial del centro
        const queryParams = new URLSearchParams({
           key: apiKey || "",
           act: "new_order",
           service_id: serviceId.toString(),
           link: link,
           count: quantity.toString()
        });

        const orderReq = await fetch(`https://top4smm.com/api.php?${queryParams.toString()}`, {
            method: "GET",
            cache: "no-store"
        });
        
        const rawResponse = await orderReq.text();
        let orderRes: any;
        try {
            orderRes = JSON.parse(rawResponse);
        } catch (e) {
            console.error("Order processing sync failure:", rawResponse);
            throw new Error("Error de sincronización en el procesamiento interno. Por favor, contacta a soporte para verificar tu solicitud.");
        }

        if (orderRes.error) {
            const msg = orderRes.error.error_message || "incidencia desconocida";
            throw new Error(`Sistema: ${msg}`);
        }

        if (!orderRes.res || orderRes.res.status !== "ok") {
            throw new Error("El sistema de procesamiento no ha confirmado la recepción correcta.");
        }

        // Actualizamos nuestra orden e iniciamos ciclo de vida
        return await tx.order.update({
            where: { id: order.id },
            data: { 
               status: "Processing",
               top4smmOrderId: orderRes.res.order_id ? String(orderRes.res.order_id) : null,
               startCount: orderRes.res.start_count ? Number(orderRes.res.start_count) : 0
            }
        });
    });

    return NextResponse.json({ success: true, message: "Solicitud iniciada y enviada a procesamiento exitosamente", newBalance: transaction.charge });
  } catch (error: any) {
    console.error("Internal Transaction Error: ", error);
    return NextResponse.json({ error: "Hubo un contratiempo con tu solicitud. " + (error.message || "") }, { status: 500 });
  }
}
