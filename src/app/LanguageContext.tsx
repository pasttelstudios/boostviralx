"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const dictionary: Translations = {
  hero_title: {
    es: "Impulsa tu Presencia en Redes Sociales",
    en: "Boost Your Social Media Presence"
  },
  hero_subtitle: {
    es: "Compra seguidores, likes y vistas de la más alta calidad y lleva tus redes al siguiente nivel de manera segura.",
    en: "Buy high-quality followers, likes, and views to take your social networks to the next level safely."
  },
  get_started: {
    es: "Comenzar Ahora",
    en: "Get Started"
  },
  login: {
    es: "Iniciar Sesión",
    en: "Login"
  },
  dashboard: {
    es: "Panel de Control",
    en: "Dashboard"
  },
  services: { es: "Nuestros Servicios", en: "Our Services" },
  new_order: { es: "Nueva Orden", en: "New Order" },
  add_funds: { es: "Añadir Fondos", en: "Add Funds" },
  my_orders: { es: "Mis Pedidos", en: "My Orders" },
  admin_panel: { es: "Panel Admin", en: "Admin Panel" },
  my_balance: { es: "Mi Saldo", en: "My Balance" },
  logout: { es: "Cerrar Sesión", en: "Logout" },
  select_network: { es: "Elija una red social para la promoción", en: "Choose a social network for promotion" },
  category: { es: "Categoría", en: "Category" },
  official_service: { es: "Servicio Oficial", en: "Official Service" },
  link: { es: "Enlace", en: "Link" },
  quantity: { es: "Cantidad", en: "Quantity" },
  configurations: { es: "Configuraciones", en: "Configurations" },
  country_target: { es: "Orientación por país", en: "Country Targeting" },
  speed: { es: "Velocidad fijada", en: "Drip Feed" },
  delay: { es: "Inicio retrasado", en: "Delayed Start" },
  submit: { es: "Enviar", en: "Submit" },
  order_summary: { es: "Resumen pedido", en: "Order Summary" },
  service_name: { es: "Nombre del Servicio", en: "Service Name" },
  min_max: { es: "Mínimo / Máximo", en: "Min / Max" },
  price_1k: { es: "Precio por 1000", en: "Price per 1000" },
  total_price: { es: "Precio total", en: "Total Price" }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof dictionary) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: keyof typeof dictionary) => {
    return dictionary[key]?.[language] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
