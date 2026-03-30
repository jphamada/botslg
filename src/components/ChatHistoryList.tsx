"use client";

import { useEffect, useState } from "react";
import { getChatHistory } from "@/app/actions/chat";
import { MessageSquare, Calendar, ChevronDown, ChevronRight, User, Bot } from "lucide-react";

export function ChatHistoryList({ botId }: { botId: string }) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedChat, setExpandedChat] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const data = await getChatHistory(botId);
                setHistory(data);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [botId]);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Cargando historial...</div>;
    }

    if (history.length === 0) {
        return (
            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-10 text-slate-400" />
                <p className="text-slate-500 italic">No hay historial de chats para este bot todavía.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((chat) => (
                <div key={chat.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                    <button
                        onClick={() => setExpandedChat(expandedChat === chat.id ? null : chat.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0070D7] flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 truncate max-w-[300px] md:max-w-[500px]">
                                    {chat.title || "Conversación"}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 px-1 text-xs text-slate-400">
                                    <Calendar size={12} />
                                    <span>{new Date(chat.updated_at).toLocaleString()}</span>
                                    <span>•</span>
                                    <span>{chat.messages?.length || 0} mensajes</span>
                                </div>
                            </div>
                        </div>
                        {expandedChat === chat.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {expandedChat === chat.id && (
                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                            {chat.messages?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((msg: any) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-[#0070D7] text-white'}`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div className={`flex-1 rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-blue-50/50 border border-blue-100 text-slate-800'}`}>
                                        <div className="font-bold text-[10px] uppercase tracking-tighter mb-1 opacity-50">
                                            {msg.role === 'user' ? 'Usuario' : 'Asistente'}
                                        </div>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
