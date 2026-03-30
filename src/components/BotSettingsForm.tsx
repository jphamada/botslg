"use client";

import { useState } from "react";
import { updateBot } from "@/app/actions/bot";
import { Save, Loader2, Check } from "lucide-react";

export function BotSettingsForm({ bot }: { bot: any }) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setSaved(false);
        try {
            await updateBot(bot.id, formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            alert("Error al actualizar el bot");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Asistente</label>
                    <input
                        name="name"
                        defaultValue={bot.name}
                        required
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                        placeholder="Ej: Analista de Política"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descripción Breve</label>
                    <input
                        name="description"
                        defaultValue={bot.description}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                        placeholder="Se mostrará debajo del título del chat"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instrucciones de Personalidad (System Prompt)</label>
                    <textarea
                        name="systemPrompt"
                        defaultValue={bot.system_prompt}
                        required
                        rows={6}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070D7]/20 focus:border-[#0070D7] transition-all"
                        placeholder="Define cómo debe comportarse el bot, su tono y qué información priorizar."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0070D7] hover:bg-[#005bb5] text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : saved ? (
                    <Check size={18} />
                ) : (
                    <Save size={18} />
                )}
                {loading ? "Guardando..." : saved ? "¡Guardado!" : "Guardar Cambios"}
            </button>
        </form>
    );
}
