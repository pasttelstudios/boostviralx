"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function MisPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
         if (data.error) setError(data.error);
         else setOrders(data);
         setLoading(false);
      })
      .catch(() => {
         setError("Error de conexión");
         setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
     switch (status) {
        case "Completed": return <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs uppercase">Completado</span>;
        case "Processing": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold text-xs uppercase">Procesando</span>;
        case "Pending": return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold text-xs uppercase">Pendiente</span>;
        case "Partial": return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded font-bold text-xs uppercase">Parcial</span>;
        case "Canceled": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs uppercase">Cancelado</span>;
        default: return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded font-bold text-xs uppercase">{status}</span>;
     }
  };

  return (
    <div className="max-w-6xl mx-auto">
       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mis Pedidos</h2>
                <p className="text-slate-500 text-sm">Historial con sincronización en vivo</p>
             </div>
          </div>

          <div className="overflow-x-auto">
             {error && <div className="text-red-500 font-bold p-4 bg-red-50 rounded mb-4">{error}</div>}
             
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                   <tr>
                      <th className="p-4 rounded-tl-lg font-semibold">TICKET ID / RASTREO</th>
                      <th className="p-4 font-semibold">FECHA</th>
                      <th className="p-4 font-semibold">CARGO / SALDO</th>
                      <th className="p-4 font-semibold">CANTIDAD</th>
                      <th className="p-4 font-semibold max-w-[200px]">SERVICIO (DETALLE)</th>
                      <th className="p-4 rounded-tr-lg font-semibold text-right">ESTADO</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                   {loading && (
                     <tr>
                        <td colSpan={6} className="p-8 text-center font-bold text-slate-400 animate-pulse">
                           Sincronizando con los servidores satélite...
                        </td>
                     </tr>
                   )}
                   
                   {!loading && orders.length === 0 && (
                     <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                           Aún no tienes ningún movimiento registrado.
                        </td>
                     </tr>
                   )}

                   {!loading && orders.map(order => {
                      const isMoneyAdmin = order.top4smmOrderId?.includes("SYSTEM_BAL");
                      const isAdd = order.charge > 0;
                      
                      return (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                           <td className="p-4 font-mono text-xs text-slate-400">{order.top4smmOrderId || order.id.slice(0,8)}</td>
                           <td className="p-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                           <td className="p-4">
                              <span className={`font-mono font-bold px-2 py-1 rounded ${isMoneyAdmin ? (isAdd ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-slate-100 text-slate-700'}`}>
                                 {isMoneyAdmin && isAdd ? '+' : ''}{!isMoneyAdmin ? '-' : ''}{order.charge}$
                              </span>
                           </td>
                           <td className="p-4">{isMoneyAdmin ? '-' : order.quantity}</td>
                           <td className="p-4 max-w-[200px] truncate" title={order.serviceName}>
                              {isMoneyAdmin ? (
                                 <span className="font-bold flex items-center gap-1">🏦 {order.serviceName}</span>
                              ) : (
                                 <span>{order.serviceName} <br/><a href={order.link} target="_blank" className="text-xs text-blue-500 break-all">{order.link.substring(0,30)}...</a></span>
                              )}
                           </td>
                           <td className="p-4 text-right">
                              {getStatusBadge(order.status)}
                           </td>
                        </tr>
                      )
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
