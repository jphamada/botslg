"use client";

import { useState } from "react";
import { Copy, Check, Code } from "lucide-react";

export function EmbedCode({ botId }: { botId: string }) {
    const [copied, setCopied] = useState(false);
    const embedUrl = `https://botslg.vercel.app/embed/${botId}`;
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0"></iframe>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(iframeCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                        <Code size={16} />
                    </div>
                    <h3 className="font-semibold text-sm">Insertar en tu web</h3>
                </div>
                <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all ${
                        copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copiado!' : 'Copiar Código'}
                </button>
            </div>
            
            <p className="text-slate-400 text-xs mb-4">
                Usa este código en el CMS de tu sitio de noticias para habilitar el asistente en la nota.
            </p>
            
            <div className="relative group">
                <pre className="bg-slate-800/50 p-4 rounded-xl text-[11px] font-mono break-all text-blue-200 border border-slate-700 leading-relaxed overflow-x-hidden">
                    {iframeCode}
                </pre>
            </div>
        </div>
    );
}
