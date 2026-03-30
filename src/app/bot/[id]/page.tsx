import { Bot, Settings, Database, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddSourceForm } from "@/components/AddSourceForm";
import { ChatInterface } from "@/components/ChatInterface";
import { DeleteSourceButton } from "@/components/DeleteSourceButton";
import { EmbedCode } from "@/components/EmbedCode";

import { supabase } from "@/lib/supabase";

export default async function BotDashboard({ params }: { params: Promise<{ id: string }> }) {
    let { id } = await params;

    // Backward compatibility para caches de NextJS en el frontend
    if (id === 'asistente-politica') id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    if (id === 'archivos-2023') id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // Fetch only completed sources from Supabase
    const { data: sources } = await supabase
        .from('sources')
        .select('*')
        .eq('bot_id', id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

    // Fetch bot details from Supabase
    const { data: bot } = await supabase
        .from('bots')
        .select('name')
        .eq('id', id)
        .single();

    const botName = bot?.name || "Asistente Desconocido";

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans">
            {/* Sidebar - Same as Dashboard for now, or unified layout */}
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
                            Gestionar Bot
                        </div>
                        <Link href={`/bot/${id}`} className="flex items-center gap-3 px-3 py-2 bg-[#0070D7]/10 text-[#0070D7] rounded-md font-medium text-sm">
                            <Database size={18} />
                            Fuentes e Ingesta
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
                            <MessageSquare size={18} />
                            Historial de Chats
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-slate-600 rounded-md font-medium text-sm transition-colors">
                            <Settings size={18} />
                            Configuración
                        </Link>
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
                        <h2 className="font-semibold">{botName}</h2>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Lado Izquierdo: Configuración e Ingestas */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-900">Fuentes de Conocimiento</h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Añade documentos o enlaces para entrenar a este bot. El conocimiento será aislado a este espacio.
                                </p>
                            </div>

                            {/* Ingestion Form */}
                            <div className="mb-8">
                                <AddSourceForm botId={id} />
                            </div>

                            {/* Ingested Sources List */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                                    <h3 className="font-semibold text-slate-900">Fuentes Indexadas</h3>
                                    <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">{sources?.length || 0}</span>
                                </div>

                                {sources && sources.length > 0 ? (
                                    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
                                        {sources.map(source => (
                                            <div key={source.id} className="p-4 flex gap-3 items-start hover:bg-slate-50 transition-colors">
                                                <div className={`mt-0.5 p-2 rounded-lg ${source.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : source.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0070D7]'}`}>
                                                    <Database size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate" title={source.content_url}>{source.content_url}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                        <span className="uppercase tracking-wider font-semibold">{source.type}</span>
                                                        <span>•</span>
                                                        <span className={`${source.status === 'completed' ? 'text-emerald-600' : source.status === 'error' ? 'text-red-600' : 'text-[#0070D7]'}`}>
                                                            {source.status === 'processing' ? 'Procesando...' : source.status === 'completed' ? 'Indexado' : 'Error'}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(source.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                {/* Delete button positioned to the right */}
                                                <DeleteSourceButton sourceId={source.id} botId={id} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500 text-sm flex-1 flex flex-col justify-center items-center">
                                        <Database size={32} className="mb-3 opacity-20" />
                                        <p>No hay fuentes recientes.</p>
                                        <p className="text-xs mt-1">Ingesta un nuevo enlace o RSS en el formulario superior.</p>
                                    </div>
                                )}
                            </div>

                            {/* Embed Section */}
                            <EmbedCode botId={id} />
                        </div>

                        {/* Lado Derecho: Interfaz de Chat interactiva */}
                        <div className="flex flex-col h-full">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Probar Asistente</h2>
                            </div>
                            <ChatInterface botId={id} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
