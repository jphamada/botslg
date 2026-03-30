"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { createChat } from "@/app/actions/chat";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export function ChatInterface({ botId, botName, botDescription, isEmbed = false }: { botId: string, botName?: string, botDescription?: string, isEmbed?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || loading) return;

        let currentChatId = chatId;
        const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // If this is the first message of the session, create a Chat record
            if (!currentChatId) {
                const newChat = await createChat(botId, input.substring(0, 50));
                currentChatId = newChat.id;
                setChatId(currentChatId);
            }

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    botId,
                    chatId: currentChatId
                }),
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            if (!response.body) throw new Error("No response body");

            // Handle streaming response directly
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const assistantMessageId = (Date.now() + 1).toString();

            setMessages((prev) => [
                ...prev,
                { id: assistantMessageId, role: "assistant", content: "" }
            ]);

            let done = false;
            let text = "";
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                text += chunkValue;

                setMessages((prev) =>
                    prev.map(msg =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: msg.content + chunkValue }
                            : msg
                    )
                );
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), role: "assistant", content: "Lo siento, ha ocurrido un error al intentar conectarme con el modelo. Por favor, revisa la configuración." }
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`flex flex-col border border-slate-200 bg-white shadow-sm overflow-hidden flex-1 ${isEmbed ? 'h-screen border-none rounded-none shadow-none' : 'h-[600px] rounded-xl'}`}>
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0070D7]/10 text-[#0070D7] flex items-center justify-center">
                    <Bot size={18} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{botName || "Asistente JN"}</h3>
                    <p className="text-xs text-slate-500">{botDescription || "Responde basándose en el contexto."}</p>
                </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Bot size={48} className="mb-4 opacity-20" />
                        <p className="text-sm">Envía un mensaje para comenzar la conversación.</p>
                    </div>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-slate-200 text-slate-600" : "bg-[#0070D7] text-white"
                                }`}>
                                {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user"
                                    ? "bg-slate-100 text-slate-900"
                                    : "bg-blue-50/50 border border-blue-100/50 text-slate-800"
                                }`}>
                                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                        placeholder="Hacé una pregunta"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] disabled:opacity-50 transition-all font-sans"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0070D7] text-white rounded-lg hover:bg-[#005bb5] disabled:opacity-50 disabled:hover:bg-[#0070D7] transition-colors"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
