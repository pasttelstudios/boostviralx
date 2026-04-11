import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoostViralX - Impulsa tus Redes",
  description: "Compra seguidores, likes y más. La mejor opción del mercado.",
  icons: {
    icon: [
      { url: "https://i.imgur.com/FWdL3Yt.png", type: "image/png" }
    ],
    shortcut: "https://i.imgur.com/FWdL3Yt.png",
    apple: "https://i.imgur.com/FWdL3Yt.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
