"use client";

import { useState } from "react";
import { User, Lock, Save, KeyRound } from "lucide-react";
import { updateProfileNameAction, updateProfilePasswordAction } from "../../actions/profile";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Actualizando...");
    const res = await updateProfileNameAction(name);
    if (res.error) {
      setError(res.error);
      setMessage("");
    } else {
      setMessage("✅ Nombre actualizado correctamente");
      setError("");
      update(); // Refresh session
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }
    setMessage("Cambiando contraseña...");
    const res = await updateProfilePasswordAction(currentPass, newPass);
    if (res.error) {
      setError(res.error);
      setMessage("");
    } else {
      setMessage("✅ Contraseña cambiada con éxito. Usa tu nueva clave el próximo inicio.");
      setError("");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -mr-10 -mt-10" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Configuración del Perfil</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Gestiona tu identidad y seguridad en BoostViralX.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Datos Personales */}
          <form onSubmit={handleUpdateName} className="space-y-6">
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">Datos Personales</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
                <input 
                  type="text" 
                  disabled 
                  value={session?.user?.email || ""} 
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1 italic">El correo no puede ser cambiado por seguridad.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95">
              <Save size={18} /> GUARDAR NOMBRE
            </button>
          </form>

          {/* Seguridad */}
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs">Seguridad</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contraseña Actual</label>
                <div className="relative">
                   <input 
                    type="password" 
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nueva Contraseña</label>
                <div className="relative">
                   <input 
                    type="password" 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Contraseña nueva"
                  />
                  <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Repetir Nueva Contraseña</label>
                <div className="relative">
                   <input 
                    type="password" 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Confirmar contraseña"
                  />
                  <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
                </div>
              </div>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 w-full bg-slate-800 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">
              CAMBIAR CONTRASEÑA
            </button>
          </form>
        </div>

        {message && <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-center font-bold border border-green-100 dark:border-green-800/50">{message}</div>}
        {error && <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-center font-bold border border-red-100 dark:border-red-800/50">{error}</div>}
      </div>
    </div>
  );
}
