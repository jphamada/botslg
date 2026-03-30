import { ChatInterface } from "@/components/ChatInterface";
import { supabase } from "@/lib/supabase";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EmbedPage({ params }: Props) {
    let { id } = await params;

    // Backward compatibility para caches
    if (id === 'asistente-politica') id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    // Fetch bot details for branding
    const { data: bot } = await supabase
        .from('bots')
        .select('name, description')
        .eq('id', id)
        .single();

    const botName = bot?.name || "Asistente JN";
    const botDescription = bot?.description || "Responde basándose en el contexto.";

    return (
        <div className="h-screen w-full bg-white overflow-hidden flex flex-col p-0 m-0">
            <ChatInterface botId={id} botName={botName} botDescription={botDescription} isEmbed={true} />
        </div>
    );
}
