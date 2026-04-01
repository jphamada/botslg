"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteSource } from "@/app/actions/ingest";

export function DeleteSourceButton({ sourceId, botId }: { sourceId: string, botId: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta fuente? El conocimiento se borrará de forma permanente de Pinecone y ya no será utilizado por este asistente.")) {
            return;
        }

        setLoading(true);
        try {
            const res = await deleteSource(sourceId, botId);
            if (res && !res.success) {
                alert(`Error al eliminar la fuente: ${res.error}`);
            }
            // Revalidation happens on the server, screen will auto update
        } catch (error: any) {
            alert(`Error al eliminar la fuente: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 focus:outline-none"
            title="Eliminar Fuente"
        >
            {loading ? (
                <span className="w-5 h-5 flex items-center justify-center border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
            ) : (
                <Trash2 size={18} />
            )}
        </button>
    );
}
