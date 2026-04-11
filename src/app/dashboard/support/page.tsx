"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Plus, CheckCircle2, Clock, Inbox, ChevronRight, X } from "lucide-react";
import { getTicketsAction, createTicketAction, sendMessageAction, updateTicketStatusAction } from "../../actions/support";
import { useSession } from "next-auth/react";

export default function SupportPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [initialMsg, setInitialMsg] = useState("");
  const [reply, setReply] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchTickets = async () => {
    const res = await getTicketsAction();
    if (res.tickets) {
        setTickets(res.tickets);
        if (selectedTicket) {
            const updated = res.tickets.find((t: any) => t.id === selectedTicket.id);
            if (updated) setSelectedTicket(updated);
        }
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000); // Polling cada 10s
    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Abriendo ticket...");
    const res = await createTicketAction(subject, initialMsg);
    if (res.error) setStatusMsg("❌ " + res.error);
    else {
        setStatusMsg("✅ Ticket abierto con éxito");
        setSubject("");
        setInitialMsg("");
        setIsCreating(false);
        fetchTickets();
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    const res = await sendMessageAction(selectedTicket.id, reply);
    if (!res.error) {
        setReply("");
        fetchTickets();
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm("¿Seguro que quieres finalizar este ticket?")) return;
    const res = await updateTicketStatusAction(selectedTicket.id, "Resolved");
    if (!res.error) {
        fetchTickets();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[75vh] gap-6">
      
      {/* Sidebar de Tickets */}
      <div className={`w-full md:w-80 flex flex-col gap-4 ${isCreating || selectedTicket ? 'hidden md:flex' : 'flex'}`}>
         <button 
           onClick={() => setIsCreating(true)}
           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
         >
           <Plus size={20} /> NUEVO TICKET
         </button>

         <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Inbox size={14} /> Mis Consultas
               </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
               {tickets.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 italic text-sm">No tienes tickets abiertos.</div>
               ) : (
                  tickets.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => {
                        setSelectedTicket(t);
                        setIsCreating(false);
                      }}
                      className={`w-full p-4 border-b border-slate-50 dark:border-slate-800/50 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group ${selectedTicket?.id === t.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-600' : ''}`}
                    >
                       <div className="min-w-0 flex-1">
                          <p className={`font-bold truncate ${selectedTicket?.id === t.id ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                             {t.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${t.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
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

      {/* Area de Chat / Creación */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
         
         {isCreating ? (
            <div className="p-8 md:p-12 max-w-2xl mx-auto w-full">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">Abrir Soporte</h2>
                  <div className="flex items-center gap-2">
                     <button onClick={() => setIsCreating(false)} className="md:hidden text-xs font-black bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600">VOLVER</button>
                     <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-red-500"><X /></button>
                  </div>
               </div>
               <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-600 mb-2">Asunto o Categoría</label>
                     <input 
                        required 
                        type="text" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Ej: Problema con mi pedido de Instagram"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-600 mb-2">Describe tu problema detalladamente</label>
                     <textarea 
                        required 
                        rows={6}
                        value={initialMsg}
                        onChange={(e) => setInitialMsg(e.target.value)}
                        placeholder="Escribe aquí..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none"
                     />
                  </div>
                  <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                     ENVIAR TICKET
                  </button>
                  {statusMsg && <div className="text-center font-bold text-sm text-blue-600">{statusMsg}</div>}
               </form>
            </div>
         ) : selectedTicket ? (
            <>
               {/* Cabecera Chat */}
               <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 -ml-2 text-slate-500">
                        <ChevronRight className="rotate-180" size={20} />
                     </button>
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <MessageCircle size={20} className="md:size-6" />
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 dark:text-white">{selectedTicket.subject}</h3>
                        <div className="flex items-center gap-2">
                           <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase">
                              <Clock size={10} /> {selectedTicket.status}
                           </span>
                           <span className="text-slate-300">•</span>
                           <span className="text-[10px] text-slate-500 font-medium">Ticket #{selectedTicket.id.slice(0,8)}</span>
                        </div>
                     </div>
                  </div>
                  {selectedTicket.status !== 'Resolved' && (
                    <button 
                      onClick={handleCloseTicket}
                      className="text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all border border-red-100 dark:border-red-800"
                    >
                      FINALIZAR TICKET
                    </button>
                  )}
               </div>

               {/* Cuerpo Chat */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col scroll-smooth">
                  {selectedTicket.messages.map((m: any) => {
                     const isSupport = m.senderName === "Soporte BoostViralX";
                     const isMe = m.senderId === (session?.user as any)?.id || (!isSupport && !(session?.user as any)?.id); // Basic check
                     
                     return (
                        <div key={m.id} className={`flex ${isSupport ? 'justify-start' : 'justify-end'}`}>
                           <div className={`max-w-[85%] md:max-w-[70%] space-y-1`}>
                              <div className={`flex items-center gap-2 mb-1 ${isSupport ? 'flex-row' : 'flex-row-reverse'}`}>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{m.senderName}</span>
                                 <span className="text-[10px] text-slate-300">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isSupport ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                 {m.text}
                              </div>
                           </div>
                        </div>
                     )
                  })}
                  {selectedTicket.status === 'Resolved' && (
                     <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                        <CheckCircle2 size={32} className="text-green-500" />
                        <p className="font-bold">Este ticket ha sido marcado como RESUELTO.</p>
                        <p className="text-xs">Si necesitas más ayuda, abre un nuevo ticket.</p>
                     </div>
                  )}
               </div>

               {/* Footer / Input */}
               {selectedTicket.status !== 'Resolved' && (
                 <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSendReply} className="flex gap-2">
                       <input 
                          type="text"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Escribe tu mensaje aquí..."
                          className="flex-1 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                       />
                       <button className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                          <Send size={20} />
                       </button>
                    </form>
                 </div>
               )}
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                  <MessageCircle size={40} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">Centro de Soporte</h3>
                  <p className="text-slate-400 max-w-sm mt-1">Selecciona un ticket de la izquierda o crea uno nuevo para comunicarte con nosotros.</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
