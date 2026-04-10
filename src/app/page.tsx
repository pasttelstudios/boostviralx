"use client";

import React from "react";
import { useLanguage } from "./LanguageContext"; // Import from the file I created
import { Globe, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react";

// Lista de plataformas
const PLATFORMS = [
  { name: "Instagram", color: "text-pink-500", bg: "bg-pink-50" },
  { name: "YouTube", color: "text-red-500", bg: "bg-red-50" },
  { name: "TikTok", color: "text-black dark:text-white", bg: "bg-gray-100 dark:bg-gray-800" },
  { name: "Twitch", color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Kick", color: "text-green-500", bg: "bg-green-50" },
  { name: "Facebook", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Telegram", color: "text-sky-500", bg: "bg-sky-50" },
  { name: "Spotify", color: "text-green-500", bg: "bg-green-50" },
  { name: "SoundCloud", color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Twitter / X", color: "text-black dark:text-white", bg: "bg-gray-100 dark:bg-gray-800" },
  { name: "LinkedIn", color: "text-blue-700", bg: "bg-blue-50" },
  { name: "Reddit", color: "text-orange-600", bg: "bg-orange-50" }
];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">BoostViral<span className="text-blue-600">X</span></span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              <a href="/login" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                {t("login")}
              </a>
              <a href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                {t("get_started")}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 overflow-hidden">
        {/* Titulo y Hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 font-semibold text-sm mb-6 border border-blue-100 dark:border-blue-800">
            {language === 'es' ? '🚀 El panel #1 de Crecimiento Social' : '🚀 The #1 Social Growth Panel'}
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white leading-tight">
            {language === 'es' ? 'Domina el algoritmo en' : 'Dominate the algorithm on'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              {language === 'es' ? 'Cualquier Plataforma' : 'Any Platform'}
            </span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero_subtitle")}
          </p>
          
          <div className="flex justify-center gap-4">
             <a href="/register" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                <Zap className="w-5 h-5 fill-current text-blue-500" />
                {t("get_started")}
             </a>
             <a href="#services" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm">
                {t("services")}
             </a>
          </div>
        </div>

        {/* Sección de logotipos de redes sociales */}
        <div className="mt-24 max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">
            {language === 'es' ? 'Potenciamos todas estas redes sociales' : 'We boost all these social networks'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {PLATFORMS.map((platform) => (
              <div 
                key={platform.name}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl ${platform.bg} border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-default font-bold ${platform.color}`}
              >
                {platform.name}
              </div>
            ))}
          </div>
        </div>

        {/* Sección Beneficios y Funcionalidad */}
        <div className="mt-32 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {language === 'es' ? '¿Por qué elegir BoostViralX?' : 'Why choose BoostViralX?'}
              </h2>
              <div className="space-y-6">
                {[
                  language === 'es' ? 'Precios más bajos del mercado garantizados.' : 'Lowest prices on the market guaranteed.',
                  language === 'es' ? 'Entrega automática 24/7 sin esperas.' : 'Automatic 24/7 delivery with no waiting.',
                  language === 'es' ? 'Servicios seguros y libres de caídas (Refill disponible).' : 'Safe, non-drop services (Refill available).',
                  language === 'es' ? 'Soporte prioritario para clientes y agencias.' : 'Priority support for clients and agencies.'
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="text-blue-500 w-6 h-6 flex-shrink-0" />
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative">
               <div className="absolute -top-6 -right-6 bg-blue-600 text-white font-bold px-6 py-2 rounded-full uppercase tracking-wider text-sm shadow-xl rotate-12">
                 Best Choice
               </div>
               <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                 {language === 'es' ? 'Cómo Funciona' : 'How it works'}
               </h3>
               <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-lg dark:text-white">{language === 'es' ? 'Regístrate Gratis' : 'Sign Up Free'}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Crea tu cuenta en menos de 10 segundos.' : 'Create your account in less than 10 seconds.'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 border border-blue-200">2</div>
                    <div>
                      <h4 className="font-bold text-lg dark:text-white">{language === 'es' ? 'Recarga tu Saldo' : 'Add your Funds'}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Opciones de pago seguras para tener créditos al instante.' : 'Secure payment options to get credits instantly.'}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-lg dark:text-white">{language === 'es' ? 'Impulsa tus Redes' : 'Boost your Socials'}</h4>
                      <p className="text-slate-500 dark:text-slate-400">{language === 'es' ? 'Elige el servicio, pega el link y mira la magia ocurrir.' : 'Choose the service, paste the link and watch the magic happen.'}</p>
                    </div>
                  </div>
               </div>
            </div>
        </div>
      </main>
    </div>
  );
}
