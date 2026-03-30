import { ChatInterface } from "@/components/ChatInterface";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EmbedPage({ params }: Props) {
    let { id } = await params;

    // Backward compatibility para caches
    if (id === 'asistente-politica') id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    if (id === 'archivos-2023') id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    return (
        <div className="h-screen w-full bg-white overflow-hidden flex flex-col p-0 m-0">
            <ChatInterface botId={id} isEmbed={true} />
        </div>
    );
}
