"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Inbox, ChevronRight, User, Hash, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getAllTicketsAction, sendMessageAction, updateTicketStatusAction } from "../../../actions/support";
import { useSession } from "next-auth/react";

export default function AdminTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("Open");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = async () => {
    const res = await getAllTicketsAction();
    if (res.tickets) {
        setTickets(res.tickets);
        if (selectedTicket) {
            const updated = res.tickets.find((t: any) => t.id === selectedTicket.id);
            if (updated) setSelectedTicket(updated);
        }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    const res = await sendMessageAction(selectedTicket.id, reply);
    if (!res.error) {
        setReply("");
        fetchTickets();
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    const res = await updateTicketStatusAction(selectedTicket.id, newStatus);
    if (!res.error) {
        fetchTickets();
    }
  };

  const filteredTickets = filter === "All" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div className="flex flex-col md:flex-row h-[80vh] gap-6 max-w-[1600px] mx-auto">
      
      {/* Sidebar Admin Tickets */}
      <div className="w-full md:w-[400px] flex flex-col gap-4">
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Inbox size={20} className="text-blue-600" /> Tickets Globales
                  </h3>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{tickets.length}</span>
               </div>
               
               {/* Filtros */}
               <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {["All", "Open", "Resolved", "Pending"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {f === "All" ? "Todos" : f}
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[60vh] md:max-h-none">
               {isLoading ? (
                  <div className="p-12 text-center text-slate-400">Cargando...</div>
               ) : filteredTickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 italic text-sm">No hay tickets bajo este filtro.</div>
               ) : (
                  filteredTickets.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`w-full p-5 border-b border-slate-50 dark:border-slate-800/50 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group ${selectedTicket?.id === t.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-600' : ''}`}
                    >
                       <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                             <User size={10} /> {t.user.name || t.user.email}
                          </p>
                          <p className={`font-bold truncate ${selectedTicket?.id === t.id ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                             {t.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${t.status === 'Open' ? 'bg-green-100 text-green-700' : t.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                {t.status}
                             </span>
                             <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(t.updatedAt).toLocaleDateString()}
                             </span>
                          </div>
                       </div>
                       <ChevronRight size={16} className={`text-slate-300 group-hover:translate-x-1 transition-transform ${selectedTicket?.id === t.id ? 'text-blue-400' : ''}`} />
                    </button>
                  ))
               )}
            </div>
         </div>
      </div>

      {/* Admin Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl flex flex-col overflow-hidden relative">
         
         {selectedTicket ? (
            <>
               {/* Cabecera Admin Chat */}
               <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 border border-blue-200 dark:border-blue-800">
                        <User size={28} />
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 dark:text-white text-lg">{selectedTicket.subject}</h3>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-bold text-slate-500">{selectedTicket.user.email}</span>
                           <span className="text-slate-300">|</span>
                           <span className="text-xs text-blue-600 font-black tracking-tight">{selectedTicket.user.name}</span>
                        </div>
                     </div>
                  </div>
                  
                  {/* Status Badges para Admin */}
                  <div className="flex items-center gap-2">
                     <button onClick={() => handleUpdateStatus("Open")} className={`p-2 rounded-xl border transition-all ${selectedTicket.status === 'Open' ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-200 dark:border-slate-800'}`} title="Marcar como Abierto">
                        <AlertCircle size={18} />
                     </button>
                     <button onClick={() => handleUpdateStatus("Pending")} className={`p-2 rounded-xl border transition-all ${selectedTicket.status === 'Pending' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 dark:border-slate-800'}`} title="Marcar como Pendiente">
                        <Clock size={18} />
                     </button>
                     <button onClick={() => handleUpdateStatus("Resolved")} className={`p-2 rounded-xl border transition-all ${selectedTicket.status === 'Resolved' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 dark:border-slate-800'}`} title="Marcar como Resuelto">
                        <CheckCircle size={18} />
                     </button>
                  </div>
               </div>

               {/* Historial para Admin */}
               <div className="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col bg-slate-50/30 dark:bg-slate-950/20">
                  {selectedTicket.messages.map((m: any) => {
                     const isSupport = m.senderName === "Soporte BoostViralX";
                     const isMe = m.senderId === session?.user?.id; // Current User (should be Admin)
                     
                     return (
                        <div key={m.id} className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[85%] md:max-w-[70%] space-y-1`}>
                              <div className={`flex items-center gap-2 mb-1 ${isSupport ? 'flex-row-reverse' : 'flex-row'}`}>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{m.senderName}</span>
                                 <span className="text-[10px] text-slate-300">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${isSupport ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200 dark:border-slate-700 rounded-tl-none'}`}>
                                 {m.text}
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>

               {/* Input para Admin (Soporte) */}
               <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <form onSubmit={handleSendReply} className="flex gap-3">
                     <input 
                        type="text"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={`Respondiendo como ${session?.user?.email === 'pasttelshop2@gmail.com' ? 'Soporte BoostViralX' : 'Administrador'}...`}
                        className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                     />
                     <button className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                        <Send size={24} />
                     </button>
                  </form>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
               <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200">
                  <Hash size={64} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Centro de Gestión de Tickets</h3>
                  <p className="text-slate-400 max-w-sm mt-2 font-medium">Atiende las consultas de tus clientes y mantén el soporte al día.</p>
               </div>
               <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                     <p className="text-2xl font-black text-green-600">{tickets.filter(t => t.status === 'Open').length}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Abiertos</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                     <p className="text-2xl font-black text-orange-600">{tickets.filter(t => t.status === 'Pending').length}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Espera</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                     <p className="text-2xl font-black text-blue-600">{tickets.filter(t => t.status === 'Resolved').length}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cerrados</p>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
