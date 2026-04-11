"use client";

import { usePathname } from "next/navigation";
import { Wallet, LayoutDashboard, ShoppingCart, ShieldAlert, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const navs = [
    { title: "Nueva Orden", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Añadir Fondos", href: "/dashboard/add-funds", icon: <Wallet size={20} /> },
    { title: "Mis Pedidos", href: "/dashboard/orders", icon: <ShoppingCart size={20} /> },
    { title: "Soporte", href: "/dashboard/support", icon: <MessageCircle size={20} /> }
  ];

  return (
    <nav className="p-4 space-y-2">
      {navs.map((nav) => {
        const isActive = pathname === nav.href;
        return (
          <Link 
            key={nav.href}
            href={nav.href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
              isActive 
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            }`}
          >
            {nav.icon}
            {nav.title}
          </Link>
        )
      })}
      
      {isAdmin && (
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administración</p>
          <Link 
            href="/dashboard/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors border ${
               pathname === "/dashboard/admin"
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
                : "text-red-500/80 hover:bg-red-50 border-transparent hover:border-red-200"
            }`}
          >
            <ShieldAlert size={20} />
            Gestión de Usuarios
          </Link>
          <Link 
            href="/dashboard/admin/tickets" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors border mt-2 ${
               pathname === "/dashboard/admin/tickets"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50"
                : "text-blue-500/80 hover:bg-blue-50 border-transparent hover:border-blue-200"
            }`}
          >
            <MessageCircle size={20} />
            Tickets Globales
          </Link>
        </div>
      )}
    </nav>
  );
}
