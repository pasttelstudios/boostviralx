"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight } from "lucide-react";
import { registerUser } from "../actions/auth";

export default function Register() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const result = await registerUser(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <TrendingUp className="text-white w-7 h-7" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Crea tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-medium text-black dark:text-white border-b border-black dark:border-white pb-0.5 hover:opacity-70 transition-opacity">
            Inicia sesión
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nombre Completo o Empresa
              </label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white sm:text-sm transition-colors"
                  placeholder="Ej: Agencia Digital"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white sm:text-sm transition-colors"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña Segura
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Empezar Ahora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
