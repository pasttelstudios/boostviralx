import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { Wallet, Settings, LayoutDashboard, ShoppingCart, LogOut, Globe, ShieldAlert } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import SidebarNav from "./SidebarNav";
import LogoutButton from "./LogoutButton";
import prisma from "../../lib/prisma";
import BalanceDisplay from "./BalanceDisplay";

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
  const initialBalance = userDb?.balance || 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* Sidebar sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div className="overflow-y-auto">
          <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
            <img src="https://i.imgur.com/FWdL3Yt.png" alt="Logo" className="w-8 h-8 object-contain floating" />
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
              BoostViral<span className="text-blue-600">X</span>
            </span>
          </div>
          <SidebarNav isAdmin={isAdmin} />
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
           <BalanceDisplay initialBalance={initialBalance} />
           <LogoutButton />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
           <h1 className="text-xl font-bold text-slate-800 dark:text-white">Panel de Control</h1>
           <div className="flex items-center gap-6">
              <LanguageSwitcher />
              
              <BalanceDisplay initialBalance={initialBalance} variant="header" />

              <div title={session.user?.name || "Usuario"} className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center font-bold text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-800">
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
