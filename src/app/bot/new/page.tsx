import { Bot, ArrowLeft, Settings, Database, MessageSquare } from "lucide-react";
import Link from "next/link";
import { createBot } from "@/app/actions/bot";

export default function NewBotPage() {
    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans">
            {/* Sidebar - Consistent with the rest of the app */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#0070D7] transition-colors">
                            <ArrowLeft size={18} />
                            <span className="font-medium text-sm">Volver al Dashboard</span>
                        </Link>
                    </div>

                    <nav className="space-y-1">
                        <div className="pt-2 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Creación
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 bg-[#0070D7]/10 text-[#0070D7] rounded-md font-medium text-sm">
                            <PlusIcon size={18} />
                            Nuevo Asistente
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0070D7]/10 text-[#0070D7] flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <h2 className="font-semibold text-slate-800">Diseñar Nuevo Asistente</h2>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Crea tu cerebro digital</h1>
                            <p className="text-slate-500 text-lg mt-2">Configura la personalidad y el propósito de tu nuevo bot periodista.</p>
                        </div>

                        <form action={createBot} className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                                        Nombre del Asistente
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Ej. Análisis Electoral, Archivo 2024..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0070D7]/10 focus:border-[#0070D7] transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                                        Descripción breve
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        placeholder="Ej. Especializado en datos de la Cámara de Senadores."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0070D7]/10 focus:border-[#0070D7] transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                {/* System Prompt / Instructions */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="systemPrompt" className="block text-sm font-semibold text-slate-700">
                                            Instrucciones de Personalidad (System Prompt)
                                        </label>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono uppercase tracking-tighter">Motor: Gemini/Llama</span>
                                    </div>
                                    <textarea
                                        id="systemPrompt"
                                        name="systemPrompt"
                                        required
                                        rows={6}
                                        placeholder="Define cómo debe comportarse. Ej: 'Eres un periodista de investigación serio. Responde siempre basándote en datos, evita las especulaciones y mantén un tono profesional.'"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0070D7]/10 focus:border-[#0070D7] transition-all placeholder:text-slate-400 resize-none"
                                    ></textarea>
                                    <p className="text-xs text-slate-400">Estas instrucciones definen el tono y límites éticos del bot.</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href="/"
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    className="px-8 py-2.5 rounded-xl bg-[#0070D7] text-white font-bold text-sm hover:bg-[#005bb5] transition-all shadow-lg shadow-[#0070D7]/30 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Crear Asistente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

function PlusIcon({ size = 18 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}
