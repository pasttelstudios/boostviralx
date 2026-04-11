"use client";

import React from "react";
import { useLanguage } from "./LanguageContext"; // Import from the file I created
import { Globe, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react";

// Lista de plataformas con iconos
const PLATFORMS = [
  { name: "Instagram", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  { name: "YouTube", icon: "https://cdn.simpleicons.org/youtube/FF0000" },
  { name: "TikTok", icon: "https://cdn.simpleicons.org/tiktok/000000" },
  { name: "Facebook", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  { name: "Twitch", icon: "https://cdn.simpleicons.org/twitch/9146FF" },
  { name: "Kick", icon: "https://cdn.simpleicons.org/kick/05FF00" },
  { name: "Telegram", icon: "https://cdn.simpleicons.org/telegram/26A5E4" },
  { name: "Spotify", icon: "https://cdn.simpleicons.org/spotify/1DB954" },
  { name: "SoundCloud", icon: "https://cdn.simpleicons.org/soundcloud/FF3300" },
  { name: "Twitter / X", icon: "https://cdn.simpleicons.org/x/000000" },
  { name: "LinkedIn", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" },
  { name: "Reddit", icon: "https://cdn.simpleicons.org/reddit/FF4500" },
  { name: "Discord", icon: "https://cdn.simpleicons.org/discord/5865F2" },
  { name: "Pinterest", icon: "https://cdn.simpleicons.org/pinterest/E60023" },
  { name: "Snapchat", icon: "https://cdn.simpleicons.org/snapchat/FFFC00" }
];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="group-hover:rotate-12 transition-transform duration-300">
                <img src="https://i.imgur.com/FWdL3Yt.png" alt="BoostViralX Logo" className="w-16 h-16 object-contain" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">
                BoostViral<span className="text-blue-600">X</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setLanguage(language === "es" ? "en" : "es")}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              <a href="/login" className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                {t("login")}
              </a>
              <a href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0">
                {t("get_started")}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-16">
        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm mb-8 border border-blue-500/20 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {language === 'es' ? '🚀 El panel #1 de Crecimiento Social' : '🚀 The #1 Social Growth Panel'}
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[0.9] sm:leading-[0.85]">
            {language === 'es' ? 'Domina el algoritmo en' : 'Dominate the algorithm on'} <br />
            <span className="text-gradient">
              {language === 'es' ? 'Cualquier Plataforma' : 'Any Platform'}
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            {t("hero_subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <a href="/register" className="group relative bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Zap className="w-6 h-6 fill-current text-blue-500 relative z-10" />
                <span className="relative z-10">{t("get_started")}</span>
             </a>
             <a href="#services" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center justify-center gap-3 shadow-lg">
                <TrendingUp className="w-6 h-6" />
                {t("services")}
             </a>
          </div>
        </div>

        {/* Scrolling Platforms Marquee */}
        <div className="mt-32 relative py-10 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800">
          <p className="text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-12">
            {language === 'es' ? 'Potenciamos todas estas redes sociales' : 'We boost all these social networks'}
          </p>
          
          <div className="flex animate-marquee whitespace-nowrap gap-8">
            {[...PLATFORMS, ...PLATFORMS].map((platform, i) => (
              <div 
                key={`${platform.name}-${i}`}
                className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <img 
                  src={platform.icon} 
                  alt={platform.name} 
                  className={`w-8 h-8 object-contain transition-all duration-300 ${platform.name === 'TikTok' || platform.name === 'Twitter / X' ? 'dark:invert' : ''} group-hover:scale-110`} 
                />
                <span className="font-black text-xl tracking-tight text-slate-800 dark:text-slate-200">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Gradient Overlays for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Benefits Section */}
        <div className="mt-40 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-left">
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[0.95]">
                {language === 'es' ? '¿Por qué elegir BoostViralX?' : 'Why choose BoostViralX?'}
              </h2>
              <div className="grid gap-8">
                {[
                  { title: language === 'es' ? 'Precios Bajos' : 'Low Prices', text: language === 'es' ? 'Precios competitivos garantizados.' : 'Guaranteed competitive prices.' },
                  { title: language === 'es' ? 'Entrega 24/7' : '24/7 Delivery', text: language === 'es' ? 'Automatizado para entregas al instante.' : 'Automated for instant deliveries.' },
                  { title: language === 'es' ? 'Servicios Seguros' : 'Safe Services', text: language === 'es' ? 'Garantía de recarga si hay caídas.' : 'Refill guarantee if drops occur.' },
                  { title: language === 'es' ? 'Soporte VIP' : 'VIP Support', text: language === 'es' ? 'Estamos aquí para ayudarte 24/7.' : 'We are here to help you 24/7.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                      <CheckCircle2 className="text-white w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group p-1">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 relative z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <div className="bg-blue-600 text-white font-black px-6 py-2 rounded-full uppercase tracking-wider text-xs shadow-xl rotate-12 floating">
                      Mejor Opción
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-12 text-slate-900 dark:text-white leading-tight">
                    {language === 'es' ? 'Cómo Funciona' : 'How it works'}
                  </h3>
                  <div className="space-y-10">
                     {[
                       { step: "1", title: language === 'es' ? 'Regístrate Gratis' : 'Sign Up Free', desc: language === 'es' ? 'Crea tu cuenta en menos de 10 segundos.' : 'Create your account in less than 10 seconds.' },
                       { step: "2", title: language === 'es' ? 'Recarga Saldo' : 'Add Funds', desc: language === 'es' ? 'Opciones seguras para créditos al instante.' : 'Secure options for instant credits.' },
                       { step: "3", title: language === 'es' ? 'Impulsa tus Redes' : 'Boost Socials', desc: language === 'es' ? 'Pega el link y mira la magia ocurrir.' : 'Paste the link and watch the magic happen.' }
                     ].map((s, i) => (
                       <div key={i} className="flex gap-6 items-start relative">
                         {i < 2 && <div className="absolute top-14 left-6 w-0.5 h-12 bg-slate-100 dark:bg-slate-800"></div>}
                         <div className={`w-12 h-12 rounded-full font-black flex items-center justify-center flex-shrink-0 text-xl ${i === 2 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                           {s.step}
                         </div>
                         <div>
                           <h4 className="font-black text-2xl dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{s.title}</h4>
                           <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-snug">{s.desc}</p>
                         </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
        </div>
      </main>
    </div>
  );
}

