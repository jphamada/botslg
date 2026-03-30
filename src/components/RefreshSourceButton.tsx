"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { reindexSource } from "@/app/actions/ingest";

export function RefreshSourceButton({ sourceId, botId, type }: { sourceId: string, botId: string, type: string }) {
    const [loading, setLoading] = useState(false);

    // Re-indexing is only useful for URL and RSS
    if (type === 'file') return null;

    async function handleRefresh() {
        setLoading(true);
        try {
            await reindexSource(sourceId, botId);
        } catch (error: any) {
            alert(`Error al re-indexar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors focus:outline-none ${
                loading ? 'text-blue-500' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Sincronizar contenido (Re-indexar)"
        >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
    );
}
