"use client";

import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";

interface BalanceDisplayProps {
  initialBalance: number;
  variant?: "sidebar" | "header";
}

export default function BalanceDisplay({ initialBalance, variant = "sidebar" }: BalanceDisplayProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/user/balance");
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
          setIsVip(data.isVip);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    const interval = setInterval(fetchBalance, 15000);
    fetchBalance();
    return () => clearInterval(interval);
  }, []);

  if (variant === "header") {
    return (
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg font-mono font-bold text-slate-800 dark:text-slate-200 shadow-inner">
        <Wallet size={18} className="text-green-600 dark:text-green-500" />
        <span className="tabular-nums">${balance.toFixed(2)}</span>
        {isVip && <span className="ml-1 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded leading-none border border-yellow-200">VIP</span>}
      </div>
    );
  }

  return (
    <div className="px-4 py-4 mb-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/20 transition-colors"></div>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center justify-between mb-1">
        Mi Saldo
        {isVip && <span className="bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded text-[10px] uppercase font-black">VIP</span>}
      </p>
      <p className="text-3xl font-black tracking-tight tabular-nums transition-all duration-500">${balance.toFixed(2)}</p>
    </div>
  );
}
