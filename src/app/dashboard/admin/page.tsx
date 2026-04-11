"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Minus, ShieldAlert, Star, Trophy, Wallet, ShoppingBag, Lock, Hash } from "lucide-react";
import { searchUserAction, updateBalanceAction, toggleVipAction, getTopUsersAction, resetUserPasswordAction, syncUserOrdersAction } from "../../actions/admin";

export default function AdminPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<"ADD" | "SUB" | "SET">("ADD");
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTop = async () => {
      const res = await getTopUsersAction();
      if (res.users) setTopUsers(res.users);
    };
    fetchTop();
  }, []);

  const handleSelectUser = async (user: any) => {
    setSelectedUser(user);
    setMessage("");
    setIsSyncing(true);
    
    // Sincronizar estados en tiempo real al seleccionar
    const res = await syncUserOrdersAction(user.id);
    if (res.orders) {
       setSelectedUser((prev: any) => ({ ...prev, orders: res.orders }));
    }
    setIsSyncing(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await searchUserAction(searchQuery);
    if (res.users) setSearchResults(res.users);
    setSelectedUser(null);
    setMessage("");
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setMessage("Procesando...");
    
    let finalAmount = Number(amount);
    if (mode === "SUB") finalAmount = -Math.abs(finalAmount);
    
    const res = await updateBalanceAction(selectedUser.email, finalAmount);
    if (res.error) setMessage("❌ " + res.error);
    else {
      setMessage("✅ Saldo actualizado. Nuevo saldo: $" + (res.balance?.toFixed(2) || "0.00"));
      setSelectedUser({ 
        ...selectedUser, 
        balance: res.balance,
        totalDeposited: (selectedUser.totalDeposited || 0) + (finalAmount > 0 ? finalAmount : 0)
      });
      setAmount("");
      // Refresh top users to reflect changes
      const topRes = await getTopUsersAction();
      if (topRes.users) setTopUsers(topRes.users);
    }
  };

  const handleToggleVip = async () => {
    if (!selectedUser) return;
    const newStatus = !selectedUser.isVip;
    setMessage("Actualizando VIP...");
    const res = await toggleVipAction(selectedUser.email, newStatus);
    if (res.error) setMessage("❌ " + res.error);
    else {
      setMessage(newStatus ? "🌟 Promovido a VIP (Precios de costo real)" : "👤 VIP Revocado (Precios +20%)");
      setSelectedUser({ ...selectedUser, isVip: newStatus });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
       <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow border border-red-200 dark:border-red-800/50 p-8">
          <div className="flex items-center gap-4 mb-4">
            <ShieldAlert size={32} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Banco y Base de Datos (Admin)</h2>
              <p className="text-red-600/80 dark:text-red-500/80">Busca a un cliente por su correo o nombre y modifica su capital virtual.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
             {/* Caja de Búsqueda */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSearch} className="space-y-4">
                   <label className="block font-bold text-slate-700 dark:text-slate-300">
                     Buscar Cliente
                   </label>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
                       placeholder="Nombre o correo..."
                     />
                     <button type="submit" className="bg-slate-800 text-white px-4 rounded-lg"><Search size={20}/></button>
                   </div>
                </form>

                <div className="mt-6 space-y-3">
                   {searchResults.map(user => (
                     <div 
                        key={user.id} 
                        onClick={() => handleSelectUser(user)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200 hover:border-red-200'}`}
                     >
                        <p className="font-bold flex items-center gap-1 text-slate-900 dark:text-white">
                           {user.name} 
                           {user.role === "ADMIN" && <span title="Admin">👑</span>}
                           {user.isVip && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                        </p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="font-mono text-green-600 font-bold mt-1">${user.balance.toFixed(2)}</p>
                     </div>
                   ))}
                </div>
             </div>

             {/* Caja de Detalles y Recarga */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                {!selectedUser ? (
                   <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <p>Selecciona un usuario para modificar su saldo</p>
                   </div>
                ) : (
                   <>
                   <form onSubmit={handleTransaction} className="space-y-6">
                      <div>
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="font-bold text-xl flex items-center gap-2 text-slate-900 dark:text-white">
                                 {selectedUser.name}
                                 {selectedUser.isVip && <Star size={18} className="text-yellow-500 fill-yellow-500" />}
                              </h3>
                              <p className="text-slate-500">{selectedUser.email}</p>
                           </div>
                           <button 
                              type="button"
                              onClick={handleToggleVip} 
                              className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1 border ${selectedUser.isVip ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                           >
                              <Star size={14} className={selectedUser.isVip ? "fill-yellow-500" : ""} />
                              {selectedUser.isVip ? "Quitar VIP" : "Ascender a VIP"}
                           </button>
                        </div>
                        
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded flex gap-4 items-center">
                           <span className="text-slate-600 dark:text-slate-400">Saldo Actual:</span>
                           <span className="text-xl font-bold font-mono text-green-600 flex-1">${selectedUser.balance.toFixed(2)}</span>
                           
                           {selectedUser.isVip && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">Compra sin comisión</span>}
                        </div>
                      </div>

                      <div>
                         <label className="block font-bold mt-6 mb-2 text-slate-700 dark:text-slate-300 text-sm">Acción de Saldo</label>
                         <div className="flex gap-2 mb-4">
                            <button type="button" onClick={() => setMode("ADD")} className={`flex-1 py-2 rounded font-bold border ${mode === "ADD" ? "bg-green-100 text-green-700 border-green-300" : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}>Añadir (+)</button>
                            <button type="button" onClick={() => setMode("SUB")} className={`flex-1 py-2 rounded font-bold border ${mode === "SUB" ? "bg-red-100 text-red-700 border-red-300" : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"}`}>Quitar (-)</button>
                         </div>
                         
                         <input 
                           type="number" 
                           step="0.01"
                           min="0.01"
                           required
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           className="w-full px-3 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-lg text-slate-900 dark:text-white"
                           placeholder="Ej: 50.00"
                         />
                      </div>

                      <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white shadow-md ${mode === "ADD" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                         {mode === "ADD" ? "Sumar Dinero" : "Restar Dinero"}
                      </button>

                      {message && <div className="p-3 text-center rounded bg-slate-100 dark:bg-slate-800 font-bold mt-4 text-slate-700 dark:text-slate-300">{message}</div>}
                   </form>

                   {/* Historial acumulado y seguridad */}
                   <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-500 font-bold uppercase tracking-tight">Depósito Histórico Total:</span>
                         <span className="font-black text-green-600 dark:text-green-400 font-mono text-lg">
                            ${selectedUser.totalDeposited?.toFixed(2) || "0.00"}
                         </span>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-4">
                         <h4 className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-300 text-xs tracking-widest uppercase">
                            <Lock size={14} className="text-slate-400" /> Seguridad
                         </h4>
                         <div className="space-y-2">
                            <input 
                               type="text"
                               value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}
                               className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white"
                               placeholder="Nueva contraseña..."
                            />
                            <button 
                               onClick={async () => {
                                  if(!window.confirm("¿Restablecer contraseña de este usuario?")) return;
                                  const res = await resetUserPasswordAction(selectedUser.email, newPassword);
                                  if (res.error) alert("Error: " + res.error);
                                  else {
                                     alert("✅ Contraseña actualizada con éxito");
                                     setNewPassword("");
                                  }
                                }}
                               className="w-full bg-slate-800 dark:bg-slate-700 text-white py-2 rounded-lg text-[10px] font-black tracking-widest uppercase hover:bg-black dark:hover:bg-slate-600 transition-colors"
                            >
                               RESTABLECER CONTRASEÑA
                            </button>
                         </div>
                      </div>
                   </div>

                   {selectedUser.orders && selectedUser.orders.length > 0 && (
                      <div className="mt-8 border-t pt-6">
                         <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm">
                               Últimos Movimientos 
                               <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 rounded-full text-xs">{selectedUser.orders.length}</span>
                            </h4>
                            {isSyncing && <span className="text-[10px] font-black text-blue-600 animate-pulse uppercase tracking-widest">Sincronizando con Proveedor...</span>}
                         </div>
                         <div className="overflow-x-auto max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                               <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700">
                                  <tr>
                                     <th className="p-3">Fecha</th>
                                     <th className="p-3">Servicio</th>
                                     <th className="p-3">Cargo/Abono</th>
                                     <th className="p-3 text-right">Estado</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y dark:divide-slate-800">
                                  {selectedUser.orders.map((order: any) => {
                                     const isBalSys = order.top4smmOrderId === "SYSTEM_BAL";
                                     return (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b last:border-0 dark:border-slate-800">
                                           <td className="p-3 whitespace-nowrap text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                           <td className="p-3">
                                              <div className="flex flex-col">
                                                 <span className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]" title={order.serviceName}>
                                                    {isBalSys ? "🏦 " : "⚡ "}{order.serviceName}
                                                 </span>
                                                 {!isBalSys && (
                                                    <span className="text-[9px] font-black text-blue-500 flex items-center gap-0.5 mt-0.5">
                                                       <Hash size={8} /> ID Oficial: {order.top4smmOrderId || "PEND..."}
                                                    </span>
                                                 )}
                                              </div>
                                           </td>
                                           <td className="p-3 font-mono font-bold">
                                              <span className={order.charge > 0 && isBalSys ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded text-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 px-2 py-1 rounded text-xs'}>
                                                 {isBalSys && order.charge > 0 ? '+' : ''}{!isBalSys ? '-' : ''}{order.charge}$
                                              </span>
                                           </td>
                                           <td className="p-3 text-right">
                                               <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                                                  order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20' : 
                                                  order.status === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20' : 
                                                  'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20'
                                               }`}>
                                                 {order.status}
                                               </span>
                                           </td>
                                        </tr>
                                     );
                                  })}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   )}
                   </>
                )}
             </div>
          </div>

        {/* Top 10 Users Ranking */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-8">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-600">
                 <Trophy size={28} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-800 dark:text-white">Ranking de Clientes Top 10</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Análisis de valor acumulado y métricas de pedidos.</p>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                       <th className="px-4 py-4 text-center">Rank</th>
                       <th className="px-4 py-4">Cliente</th>
                       <th className="px-4 py-4">S. Actual</th>
                       <th className="px-4 py-4">Inversión Total</th>
                       <th className="px-4 py-4 text-center">Pedidos</th>
                       <th className="px-4 py-4 text-right">Acción</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {topUsers.map((user, index) => (
                       <tr 
                          key={user.id} 
                          className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                          onClick={() => {
                             handleSelectUser(user);
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                       >
                          <td className="px-4 py-5 text-center">
                             <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full font-black text-xs ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                #{index + 1}
                             </span>
                          </td>
                          <td className="px-4 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-blue-600">
                                   {user.name && user.name.length > 0 ? user.name[0] : '?'}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                                      {user.name}
                                      {user.isVip && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                                   </p>
                                   <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-4 py-5">
                             <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black font-mono">
                                <Wallet size={14} className="text-slate-400" />
                                ${user.balance.toFixed(2)}
                             </div>
                          </td>
                          <td className="px-4 py-5 font-black text-green-600 dark:text-green-400">
                             ${user.totalDeposited?.toFixed(2) || "0.00"}
                          </td>
                          <td className="px-4 py-5 text-center">
                             <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-black text-slate-600 dark:text-slate-400">
                                <ShoppingBag size={12} />
                                {user.orderCount}
                             </div>
                          </td>
                          <td className="px-4 py-5 text-right">
                             <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                Gestionar <Search size={12} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
       </div>
    </div>
  );
}
