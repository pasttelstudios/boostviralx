import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { Wallet, Settings, LayoutDashboard, ShoppingCart, LogOut, Globe, ShieldAlert } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import SidebarNav from "./SidebarNav";
import prisma from "../../lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const isAdmin = (session.user as any)?.role === "ADMIN";

  const userEmail = session.user?.email;
  const userDb = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null;
  const realBalance = userDb?.balance || 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              BoostViral<span className="text-blue-600">X</span>
            </span>
          </div>
          <SidebarNav isAdmin={isAdmin} />
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
           <div className="px-4 py-3 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                 Mi Saldo
                 {userDb?.isVip && <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">VIP</span>}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${realBalance.toFixed(2)}</p>
           </div>
           <a href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl font-medium transition-colors">
              <LogOut size={20} />
              Cerrar Sesión
           </a>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
           <h1 className="text-xl font-bold text-slate-800 dark:text-white">Panel de Control</h1>
           <div className="flex items-center gap-6">
              <LanguageSwitcher />
              
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg font-mono font-bold text-slate-800 dark:text-slate-200">
                 <Wallet size={18} className="text-green-600 dark:text-green-500" />
                 ${realBalance.toFixed(2)}
                 {userDb?.isVip && <span className="ml-1 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded leading-none">VIP</span>}
              </div>

              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center font-bold text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800">
                 {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
