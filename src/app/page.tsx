"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Globe, TrendingUp, Shield, Zap, CheckCircle2, Star, Users, ArrowRight } from "lucide-react";

// Lista de plataformas para el marquee
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

// Los más vendidos
const BEST_SELLERS = [
  { platform: "Instagram", service: "Seguidores", price: "0.37", unit: "100", icon: "https://cdn.simpleicons.org/instagram/E4405F", rating: 4.7, color: "from-pink-500 to-orange-500" },
  { platform: "TikTok", service: "Seguidores", price: "0.99", unit: "100", icon: "https://cdn.simpleicons.org/tiktok/000000", rating: 4.6, color: "from-slate-900 to-black" },
  { platform: "YouTube", service: "Vistas", price: "2.29", unit: "1000", icon: "https://cdn.simpleicons.org/youtube/FF0000", rating: 4.8, color: "from-red-600 to-red-700" },
  { platform: "Kick", service: "Espectadores", price: "1.49", unit: "100", icon: "https://cdn.simpleicons.org/kick/05FF00", rating: 4.7, color: "from-green-500 to-green-600" },
  { platform: "Twitch", service: "Espectadores", price: "1.69", unit: "100", icon: "https://cdn.simpleicons.org/twitch/9146FF", rating: 4.9, color: "from-purple-600 to-indigo-600" },
  { platform: "Twitter / X", service: "Likes", price: "1.20", unit: "100", icon: "https://cdn.simpleicons.org/x/000000", rating: 4.5, color: "from-slate-800 to-slate-900" }
];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50">
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
            <div className="hidden md:flex items-center gap-6">
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
              <a href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                {t("get_started")}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* NEW HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-slate-950">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 {/* Left Column: Text */}
                 <div className="text-left animate-in fade-in slide-in-from-left-4 duration-700">
                    <p className="text-blue-600 font-black tracking-widest uppercase text-sm mb-4">
                       {language === 'es' ? 'Tu crecimiento garantizado' : 'Your growth guaranteed'}
                    </p>
                    <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] mb-8 tracking-tighter">
                       {language === 'es' ? (
                          <>Compra <span className="text-gradient">seguidores, likes, visualizaciones</span> y más — Entrega instantánea.</>
                       ) : (
                          <>Buy <span className="text-gradient">followers, likes, views</span> and more — Instant delivery.</>
                       )}
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 items-center mb-12">
                       <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                          <div className="flex -space-x-3">
                             {[1,2,3,4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-md" alt="Avatar" />
                             ))}
                          </div>
                          <div>
                             <div className="flex text-yellow-500 mb-0.5">
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                             </div>
                             <p className="text-xs font-black text-slate-500 dark:text-slate-400">
                                {language === 'es' ? '5.0 de 100+ clientes' : '5.0 from 100+ clients'}
                             </p>
                          </div>
                       </div>
                       
                       <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                             <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-black text-sm text-slate-900 dark:text-white leading-none mb-1">1.5M+</h4>
                             <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                {language === 'es' ? 'Pedidos completados' : 'Orders completed'}
                             </p>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                       <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3">
                          {t("get_started")}
                          <ArrowRight className="w-5 h-5" />
                       </a>
                    </div>
                 </div>

                 {/* Right Column: Video Visual */}
                 <div className="relative animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
                    <div className="relative flex justify-center lg:justify-end">
                       <video 
                          src="https://www.dropbox.com/scl/fi/5xeo403kbonmsukd8vnb8/vecteezy_social-media-post-got-1-million-likes_21286706.mp4?rlkey=ui2k5lnznsc8g2wah0e9nl7ny&st=jmglpws6&raw=1" 
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                          className="w-full max-w-[500px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(37,99,235,0.2)]"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* BEST SELLERS SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                 <div className="text-left">
                    <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                       {language === 'es' ? 'Los servicios' : 'The Best'} <span className="text-blue-600">{language === 'es' ? 'más vendidos' : 'Services'}</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
                       {language === 'es' ? 'Nuestros paquetes más populares y efectivos para impulsar tu presencia digital al instante.' : 'Our most popular and effective packages to boost your digital presence instantly.'}
                    </p>
                 </div>
                 <a href="/register" className="font-black text-blue-600 flex items-center gap-2 group">
                    {language === 'es' ? 'Ver todos los servicios' : 'View all services'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {BEST_SELLERS.map((s, i) => (
                    <div key={i} className="group bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-2">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`p-3 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                             <img src={s.icon} className="w-8 h-8 object-contain brightness-0 invert" alt={s.platform} />
                          </div>
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                             <Star className="w-3 h-3 text-yellow-500 fill-current" />
                             <span className="text-xs font-black text-slate-700 dark:text-slate-300">{s.rating}</span>
                          </div>
                       </div>
                       
                       <h3 className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-1">{s.platform}</h3>
                       <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{s.service}</h4>
                       
                       <div className="flex items-baseline gap-1 mb-8">
                          <span className="text-slate-900 dark:text-white text-3xl font-black">${s.price}</span>
                          <span className="text-slate-400 text-sm font-bold lowercase">per {s.unit}</span>
                       </div>

                       <a href="/register" className="w-full bg-slate-900 dark:bg-slate-800 dark:hover:bg-blue-600 text-white rounded-2xl py-4 font-black transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 shadow-xl shadow-blue-500/0 group-hover:shadow-blue-500/20">
                          {language === 'es' ? 'Pedido' : 'Order Now'}
                          <Zap className="w-4 h-4" />
                       </a>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* TODO EN UNO SECTION */}
        <section className="py-40 relative overflow-hidden bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800">
           {/* Floating Icons Background */}
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[10%] left-[15%] animate-bounce duration-[6s] infinite">
                 <img src="https://cdn.simpleicons.org/telegram/26A5E4" className="w-20 h-20 drop-shadow-[0_0_20px_rgba(38,165,228,0.5)]" alt="Floating" />
              </div>
              <div className="absolute top-[20%] right-[10%] animate-floating-slow">
                 <img src="https://cdn.simpleicons.org/tiktok/000000" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:invert" alt="Floating" />
              </div>
              <div className="absolute bottom-[20%] left-[10%] animate-floating">
                 <img src="https://cdn.simpleicons.org/spotify/1DB954" className="w-20 h-20 drop-shadow-[0_0_25px_rgba(29,185,84,0.5)]" alt="Floating" />
              </div>
              <div className="absolute bottom-[10%] -right-[5%] animate-bounce duration-[8s] infinite">
                 <img src="https://cdn.simpleicons.org/facebook/1877F2" className="w-28 h-28 drop-shadow-[0_0_30px_rgba(24,119,242,0.5)]" alt="Floating" />
              </div>
              <div className="absolute top-[40%] left-[5%] animate-pulse">
                 <img src="https://cdn.simpleicons.org/youtube/FF0000" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]" alt="Floating" />
              </div>
              <div className="absolute top-[60%] right-[5%] animate-floating-slow">
                 <img src="https://cdn.simpleicons.org/twitch/9146FF" className="w-20 h-20 drop-shadow-[0_0_25px_rgba(145,70,255,0.5)]" alt="Floating" />
              </div>
              <div className="absolute bottom-[5%] left-[45%] animate-floating">
                 <img src="https://cdn.simpleicons.org/x/000000" className="w-16 h-16 dark:invert" alt="Floating" />
              </div>
              <div className="absolute top-[15%] right-[40%] animate-pulse">
                 <img src="https://cdn.simpleicons.org/instagram/E4405F" className="w-24 h-24 drop-shadow-[0_0_30px_rgba(228,64,95,0.5)]" alt="Floating" />
              </div>
           </div>

           <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-red-500 font-black tracking-widest uppercase text-lg mb-8">TODO EN UNO</h2>
              <h3 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.9]">
                 Panel BoostViralX — 15+ Plataformas, un único panel de control
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-12 font-medium">
                 YouTube, Instagram, TikTok, Twitch, Kick, Spotify, y mucho más, todo desde un único panel de control. 
                 Crea una cuenta gratuita y prueba cualquier servicio antes de comprarlo.
              </p>
              <a href="/register" className="inline-block bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-2xl">
                 Prueba gratis
              </a>
           </div>
        </section>

        {/* Scrolling Platforms Marquee (Reducido) */}
        <div className="py-12 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...PLATFORMS, ...PLATFORMS].map((platform, i) => (
              <div key={`${platform.name}-${i}`} className="flex items-center gap-4 group opacity-50 hover:opacity-100 transition-opacity">
                <img src={platform.icon} alt={platform.name} className={`w-8 h-8 object-contain ${platform.name === 'TikTok' || platform.name === 'Twitter / X' ? 'dark:invert' : ''}`} />
                <span className="font-black text-xl text-slate-400 dark:text-slate-600 group-hover:text-blue-600">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section (Updated) */}
        <section className="py-32 max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
               <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {language === 'es' ? '¿Por qué confiar en nosotros?' : 'Why trust us?'}
               </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Shield className="w-10 h-10" />, title: 'Máxima Seguridad', desc: 'Sistemas encriptados y anonimato garantizado en cada compra.' },
                  { icon: <Zap className="w-10 h-10" />, title: 'Entrega Instantánea', desc: 'Nuestro sistema automatizado inicia tu pedido en milisegundos.' },
                  { icon: <CheckCircle2 className="w-10 h-10" />, title: 'Garantía de Recarga', desc: 'Si hay caídas naturales, recargamos tu cuenta sin costo adicional.' },
                  { icon: <Users className="w-10 h-10" />, title: 'Soporte 24/7', desc: 'Asistencia VIP personalizada para resolver cualquier duda.' }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-blue-500 transition-all text-left">
                    <div className="text-blue-600 mb-6">{item.icon}</div>
                    <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
            </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center">
         <p className="text-slate-400 font-bold">© 2026 BoostViralX. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floating-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(-10deg); }
        }
        .animate-floating { animation: floating 4s ease-in-out infinite; }
        .animate-floating-slow { animation: floating-slow 6s ease-in-out infinite; }
        .text-gradient {
           background: linear-gradient(to right, #2563eb, #7c3aed, #db2777);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
