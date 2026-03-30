"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Bot, User, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(formData: FormData) {
        setLoading(true);
        setError(null);
        try {
            await login(formData);
        } catch (err: any) {
            setError(err.message || "Usuario o contraseña inválidos");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md">
                {/* Logo & Intro */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0070D7] text-white shadow-xl shadow-blue-500/20 mb-6">
                        <Bot size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GaceBot</h1>
                    <p className="text-slate-500 mt-2">Plataforma de Asistentes Periodísticos</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6">Iniciar Sesión</h2>
                        <form action={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Usuario</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070D7] transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="user"
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0070D7]/10 focus:border-[#0070D7] transition-all text-sm"
                                        placeholder="Tu usuario"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0070D7] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#0070D7]/10 focus:border-[#0070D7] transition-all text-sm"
                                        placeholder="············"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#0070D7] hover:bg-[#005bb5] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none mt-4 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    "Acceder al Panel"
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            Entorno Protegido • LA GACETA © 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
