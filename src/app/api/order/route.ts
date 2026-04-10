import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
  }

  try {
    const { serviceId, link, quantity } = await req.json();

    if (!serviceId || !link || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Faltan datos del pedido o cantidad es inválida" }, { status: 400 });
    }

    // 1. Obtener listado sagrado de precios oficial usando la Llave API secreta
    const apiKey = process.env.TOP4SMM_API_KEY;
    const fetchTop4smmServices = await fetch(`https://top4smm.com/api.php?key=${apiKey}&act=services`, { cache: "no-store" });
    const top4smmServices = await fetchTop4smmServices.json();

    if (!Array.isArray(top4smmServices)) {
       return NextResponse.json({ error: "Error conectando a los servicios de red. Intenta más tarde." }, { status: 500 });
    }

    const officialService = top4smmServices.find((s: any) => String(s.id) === String(serviceId));
    if (!officialService) {
       return NextResponse.json({ error: "Este servicio ya no existe o está en mantenimiento" }, { status: 400 });
    }

    // 2. Validación CRÍTICA de Mínimos/Máximos - Según doc oficial: min_order, max_order
    const minOrder = Number(officialService.min_order || officialService.min);
    const maxOrder = Number(officialService.max_order || officialService.max);

    if (quantity < minOrder || quantity > maxOrder) {
       return NextResponse.json({ error: `La cantidad debe estar entre ${minOrder} y ${maxOrder}` }, { status: 400 });
    }

    // 4. Bloqueo de Seguridad en Base de datos (Buscar Saldo Real)
    const userDb = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!userDb) {
      return NextResponse.json({ error: "Usuario no encontrado en base de datos" }, { status: 404 });
    }

    // 3. Cálculos matemáticos Inalterables
    const officialRate = parseFloat(officialService.rate);
    const boostRate = userDb.isVip ? officialRate : (officialRate * 1.20); // VIPs Get raw rate
    const totalToCharge = (boostRate / 1000) * quantity;

    if (userDb.balance < totalToCharge) {
      return NextResponse.json({ error: `Saldo insuficiente. Tu pedido cuesta $${totalToCharge.toFixed(2)} pero tienes $${userDb.balance.toFixed(2)}` }, { status: 402 });
    }

    // 5. Transacción Nuclear (Se resta saldo y se compra todo como un Átomo indivisible)
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

        // C) Ejecutar la API OFICIAL de Top4Smm enviando la orden real
        // Según doc oficial: act=new_order, service_id, count, link
        const orderReq = await fetch("https://top4smm.com/api.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
               key: apiKey || "",
               act: "new_order",
               service_id: serviceId.toString(),
               link: link,
               count: quantity.toString()
            }).toString()
        });
        
        const rawResponse = await orderReq.text();
        let orderRes: any;
        try {
            orderRes = JSON.parse(rawResponse);
        } catch (e) {
            console.error("Top4SMM malformed response:", rawResponse);
            throw new Error("La API oficial respondió algo inesperado (no es JSON). Por favor contacta a soporte técnico.");
        }

        // Según doc oficial: si éxito -> { res: { status: 'ok', order_id: '...' } }
        // Si error -> { error: { error_message: '...' } }
        if (orderRes.error) {
            const msg = orderRes.error.error_message || "Error desconocido en la API oficial";
            throw new Error(`Top4SMM: ${msg}`);
        }

        if (!orderRes.res || orderRes.res.status !== "ok") {
            throw new Error("La API no devolvió un estado OK");
        }

        // Actualizamos nuestra orden con su Número Oficial e iniciamos ciclo de vida
        return await tx.order.update({
            where: { id: order.id },
            data: { 
               status: "Processing",
               top4smmOrderId: orderRes.res.order_id ? String(orderRes.res.order_id) : null
            }
        });
    });

    return NextResponse.json({ success: true, message: "Pedido enviado exitosamente", newBalance: transaction.charge });
  } catch (error: any) {
    console.error("Order Transaction Failed: ", error);
    return NextResponse.json({ error: "Fallo tu pedido. Por favor avisa a soporte: " + (error.message || "") }, { status: 500 });
  }
}
