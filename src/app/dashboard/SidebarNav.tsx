"use client";

import { usePathname } from "next/navigation";
import { Wallet, LayoutDashboard, ShoppingCart, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const navs = [
    { title: "Nueva Orden", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Añadir Fondos", href: "/dashboard/add-funds", icon: <Wallet size={20} /> },
    { title: "Mis Pedidos", href: "/dashboard/orders", icon: <ShoppingCart size={20} /> }
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
        <Link 
          href="/dashboard/admin" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors mt-4 border ${
             pathname === "/dashboard/admin"
              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50"
              : "text-red-500/80 hover:bg-red-50 border-transparent hover:border-red-200"
          }`}
        >
          <ShieldAlert size={20} />
          Panel Admin
        </Link>
      )}
    </nav>
  );
}
