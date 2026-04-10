"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Wallet, LogOut, LayoutDashboard, ShoppingCart, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarNav from "./SidebarNav";
import BalanceDisplay from "./BalanceDisplay";
import LogoutButton from "./LogoutButton";
import LanguageSwitcher from "./LanguageSwitcher";

interface DashboardShellProps {
  children: React.ReactNode;
  isAdmin: boolean;
  initialBalance: number;
  userName: string;
}

export default function DashboardShell({
  children,
  isAdmin,
  initialBalance,
  userName
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      
      {/* Sidebar - Desktop static, Mobile semi-fixed drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transform transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="overflow-y-auto">
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/dashboard" className="flex items-center gap-3">
               <img src="https://i.imgur.com/FWdL3Yt.png" alt="Logo" className="w-8 h-8 object-contain" />
               <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                 BoostViral<span className="text-blue-600">X</span>
               </span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-2">
            <SidebarNav isAdmin={isAdmin} />
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
           <BalanceDisplay initialBalance={initialBalance} />
           <LogoutButton />
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Responsive Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-30">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                 <Menu size={24} />
              </button>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">
                {pathname === "/dashboard" ? "Nueva Orden" : 
                 pathname === "/dashboard/orders" ? "Mis Pedidos" : 
                 pathname === "/dashboard/add-funds" ? "Fondos" : "Dashboard"}
              </h1>
           </div>

           <div className="flex items-center gap-2 md:gap-6">
              <div className="hidden sm:block">
                 <LanguageSwitcher />
              </div>
              
              <BalanceDisplay initialBalance={initialBalance} variant="header" />

              <div title={userName} className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center font-bold text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800">
                 {userName.charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
