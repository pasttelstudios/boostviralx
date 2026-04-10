"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    const confirmed = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 group"
    >
      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-colors">
        <LogOut size={20} />
      </div>
      <span>Cerrar Sesión</span>
    </button>
  );
}
