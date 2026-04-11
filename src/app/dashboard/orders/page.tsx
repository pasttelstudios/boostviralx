"use client";

import { ShoppingCart, History, ArrowRight, Gauge, CheckCircle2, AlertCircle, Clock, RefreshCcw, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";

export default function MisPedidos() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusInfo = (status: string) => {
     switch (status) {
        case "Completed": return { 
          label: "Completado", 
          icon: <CheckCircle2 className="w-3.5 h-3.5" />, 
          className: "bg-emerald-100 text-emerald-700 border-emerald-200" 
        };
        case "Processing": return { 
          label: "Procesando", 
          icon: <Gauge className="w-3.5 h-3.5 animate-pulse" />, 
          className: "bg-blue-100 text-blue-700 border-blue-200" 
        };
        case "In progress": return { 
          label: "En Progreso", 
          icon: <Clock className="w-3.5 h-3.5 animate-spin-slow" />, 
          className: "bg-indigo-100 text-indigo-700 border-indigo-200" 
        };
        case "Pending": return { 
          label: "Pendiente", 
          icon: <Clock className="w-3.5 h-3.5" />, 
          className: "bg-amber-100 text-amber-700 border-amber-200" 
        };
        case "Partial": return { 
          label: "Parcial", 
          icon: <AlertCircle className="w-3.5 h-3.5" />, 
          className: "bg-orange-100 text-orange-700 border-orange-200" 
        };
        case "Canceled": return { 
          label: "Cancelado", 
          icon: <AlertCircle className="w-3.5 h-3.5" />, 
          className: "bg-rose-100 text-rose-700 border-rose-200" 
        };
        default: return { 
          label: status, 
          icon: <AlertCircle className="w-3.5 h-3.5" />, 
          className: "bg-slate-100 text-slate-700 border-slate-200" 
        };
     }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
       
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <History className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Historial de Servicios</h1>
                <p className="text-slate-500 text-sm">Rastreo de envíos y estado en tiempo real</p>
             </div>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm"
          >
             <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             Actualizar Estados
          </button>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
             {error && (
                <div className="m-4 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-3">
                   <AlertCircle className="w-5 h-5 flex-shrink-0" />
                   <p className="text-sm font-medium">{error}</p>
                </div>
             )}
             
             <table className="w-full text-left min-w-[700px] md:min-w-0">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] md:text-[11px] font-bold tracking-wider">
                   <tr>
                      <th className="p-3 md:p-5">Detalle Pedido</th>
                      <th className="p-3 md:p-5 text-center">Recuento</th>
                      <th className="p-3 md:p-5 text-center">Cant.</th>
                      <th className="p-3 md:p-5 text-center">Resta</th>
                      <th className="p-3 md:p-5">Fecha</th>
                      <th className="p-3 md:p-5 text-right">Estado</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {loading && orders.length === 0 && (
                      <tr>
                         <td colSpan={6} className="p-16 text-center">
                            <div className="flex flex-col items-center gap-3">
                               <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                               <p className="text-slate-400 font-medium">Sincronizando con los centros de entrega...</p>
                            </div>
                         </td>
                      </tr>
                   )}
                   
                   {!loading && orders.length === 0 && (
                      <tr>
                         <td colSpan={6} className="p-16 text-center">
                            <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
                               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-2">
                                  <ShoppingCart className="w-8 h-8" />
                                </div>
                               <p className="text-slate-800 dark:text-white font-bold">Sin movimientos activos</p>
                               <p className="text-slate-500 text-xs">Por el momento no tienes ninguna solicitud en curso. ¡Visita el Dashboard para empezar!</p>
                            </div>
                         </td>
                      </tr>
                   )}

                   {orders.map(order => {
                      const isMoneyAdmin = order.top4smmOrderId?.includes("SYSTEM_BAL");
                      const statusInfo = getStatusInfo(order.status);
                      
                      return (
                        <tr key={order.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors duration-200">
                           <td className="p-5">
                              <div className="flex flex-col gap-1.5 min-w-[200px]">
                                 <span className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1" title={order.serviceName}>
                                    {isMoneyAdmin ? `🏦 ${order.serviceName}` : order.serviceName}
                                 </span>
                                 <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50 uppercase flex items-center gap-1">
                                       <Hash size={10} /> ID Oficial: {order.top4smmOrderId || "SINC..."}
                                    </span>
                                    {!isMoneyAdmin && (
                                       <a href={order.link} target="_blank" className="text-[10px] text-blue-500 border-b border-transparent hover:border-blue-500 transition-all font-medium flex items-center gap-1">
                                          Ver Destino <ArrowRight className="w-2.5 h-2.5" />
                                       </a>
                                    )}
                                 </div>
                              </div>
                           </td>
                           <td className="p-5 text-center">
                              <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">
                                 {isMoneyAdmin ? "-" : (order.startCount !== null ? order.startCount : "--")}
                              </span>
                           </td>
                           <td className="p-5 text-center">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full font-bold text-xs ring-1 ring-slate-200 dark:ring-slate-700">
                                 {isMoneyAdmin ? "-" : `x${order.quantity}`}
                              </span>
                           </td>
                           <td className="p-5 text-center text-slate-400 italic">
                             {isMoneyAdmin ? "-" : (order.remains !== null ? order.remains : "--")}
                           </td>
                           <td className="p-5">
                              <div className="flex flex-col">
                                 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                 </span>
                                 <span className={`text-[13px] font-bold ${isMoneyAdmin ? (order.charge > 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-700 dark:text-slate-200'}`}>
                                    {order.charge > 0 ? '+' : ''}{order.charge}$
                                 </span>
                              </div>
                           </td>
                           <td className="p-5 text-right">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${statusInfo.className}`}>
                                 {statusInfo.icon}
                                 {statusInfo.label}
                              </div>
                           </td>
                        </tr>
                      )
                   })}
                </tbody>
             </table>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-5 rounded-2xl">
             <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Inicio Inmediato
             </h4>
             <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
                La mayoría de los servicios comienzan en menos de 5 minutos una vez el estado cambia a 'Procesando'.
             </p>
          </div>
          <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-5 rounded-2xl">
             <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Recarga Garantizada
             </h4>
             <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
                Si detectas caídas y tu servicio tiene garantía, el sistema lo repondrá automáticamente.
             </p>
          </div>
          <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-5 rounded-2xl">
             <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Cancelaciones
             </h4>
             <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                Si un pedido es 'Cancelado' o 'Parcial', el sistema reembolsará el saldo sobrante a tu cuenta al instante.
             </p>
          </div>
       </div>

    </div>
  );
}
