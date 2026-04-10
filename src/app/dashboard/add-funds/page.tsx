"use client";

import { Wallet, Info } from "lucide-react";

export default function AddFunds() {
  return (
    <div className="max-w-3xl mx-auto">
       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Añadir Fondos</h2>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-xl p-5 mb-8 flex gap-4">
             <Info className="flex-shrink-0 text-blue-500 w-6 h-6" />
             <div>
                <p className="text-slate-700 dark:text-slate-300">
                  Por ahora las recargas son procesadas manualmente para mayor seguridad. Sigue las instrucciones a continuación para obtener saldo en tu cuenta en minutos.
                </p>
             </div>
          </div>

          <div className="space-y-6">
             <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Recarga Directa</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Comunícate con nuestro soporte por WhatsApp para recargar tu cuenta al instante mediente tu método local favorito.</p>
                <a href="https://wa.me/17862672289" target="_blank" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg">
                  Comprar Saldo por WhatsApp
                </a>
             </div>
          </div>

          <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
            Manda el comprobante junto a tu correo <strong>(el correo con el que te registraste)</strong> y te abonaremos los dólares de inmediato.
          </div>
       </div>
    </div>
  );
}
