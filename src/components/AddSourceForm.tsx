"use client";

import { useState } from "react";
import { processSource } from "@/app/actions/ingest";
import { Link as LinkIcon, Rss } from "lucide-react";

export function AddSourceForm({ botId }: { botId: string }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [type, setType] = useState<"url" | "rss" | "file">("url");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setSuccess(false);
        setError(null);
        formData.append("botId", botId);

        try {
            const res = await processSource(formData);
            if (!res || !res.success) {
                setError(res?.error || "Ocurrió un error al procesar la fuente.");
                return;
            }
            setSuccess(true);
            const form = document.getElementById('add-source-form') as HTMLFormElement;
            form.reset();
            setType("url");
        } catch (err: any) {
            setError(err.message || "Ocurrió un error al procesar la fuente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id="add-source-form" action={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#0070D7]">
                    <LinkIcon size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Ingestar Nueva Fuente</h3>
                    <p className="text-sm text-slate-500">Añade enlaces periodísticos, feeds RSS o texto libre al bot.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                            <select
                                name="type"
                                required
                                value={type}
                                onChange={(e) => setType(e.target.value as "url" | "rss" | "file")}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                            >
                                <option value="url">Página Web (URL)</option>
                                <option value="rss">Feed RSS</option>
                                <option value="file">Texto Plano</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            {type === "file" ? (
                                <>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Título del Documento</label>
                                    <input
                                        type="text"
                                        name="url"
                                        placeholder="Ej: Discurso de Apertura 2024"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                                    />
                                </>
                            ) : (
                                <>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Enlace</label>
                                    <input
                                        type="url"
                                        name="url"
                                        placeholder="https://ejemplo.com/noticia"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {type === "file" && (
                        <div className="w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contenido de Texto</label>
                            <textarea
                                name="textData"
                                placeholder="Pega aquí el contenido de texto que deseas ingestar..."
                                required
                                rows={6}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all resize-y"
                            ></textarea>
                        </div>
                    )}
                </div>

                {error && <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-100">{error}</div>}
                {success && <div className="text-emerald-700 text-sm p-3 bg-emerald-50 rounded-md border border-emerald-100">¡Fuente procesada y agregada con éxito!</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0070D7] hover:bg-[#005bb5] text-white py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {loading ? "Procesando, por favor espera..." : "Procesar e Ingestar"}
                </button>
            </div>
        </form>
    );
}
