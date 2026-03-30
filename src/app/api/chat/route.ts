import { HfInference } from "@huggingface/inference";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { pinecone } from "@/lib/pinecone";
import { supabase } from "@/lib/supabase";

// Using default Node.js runtime instead of edge for langchain compatibility

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
    try {
        let { messages, botId } = await req.json();

        if (botId === "asistente-politica") botId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
        if (botId === "archivos-2023") botId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

        if (!botId) {
            return new Response("Missing botId", { status: 400 });
        }

        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content;

        // 1. Get bot details from Supabase (including its specific system prompt)
        const { data: bot } = await supabase
            .from("bots")
            .select("*")
            .eq("id", botId)
            .single();

        // 2. Generate embeddings for the user query using HF (must match ingest)
        const embeddings = new HuggingFaceInferenceEmbeddings({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            apiKey: process.env.HUGGINGFACE_API_KEY,
        });
        const queryVector = await embeddings.embedQuery(userQuery);

        // 3. Search Pinecone for context
        const indexName = process.env.PINECONE_INDEX || "chatbots";
        const index = pinecone.Index(indexName);
        const botIndex = index.namespace(botId);

        const queryResponse = await botIndex.query({
            vector: queryVector,
            topK: 5,
            includeMetadata: true,
        });

        const contexts = queryResponse.matches
            .map((match) => match.metadata?.text || "")
            .join("\n\n");

        // 4. Construct System Prompt with Context
        const systemInstruction = bot?.system_prompt || "Eres un asistente de investigación periodística. Responde de manera clara y profesional usando la información proporcionada.";
        const systemPrompt = `
${systemInstruction}

CONTEXTO ENCONTRADO EN LA BASE DE DATOS:
-------------------------
${contexts}
-------------------------

Responde la pregunta del usuario utilizando estrictamente la información del contexto anterior. 
Reglas de la respuesta:
1. NUNCA respondas replicando o citando los artículos de manera literal.
2. Tus respuestas deben ser condensadas, breves y concisas.
3. ESTRICTAMENTE tu respuesta no debe superar los 400 caracteres en total.

Si la respuesta no se encuentra en el contexto, indícalo de forma honesta. No inventes datos.`;

        // 5. Construct Chat History for HuggingFace Llama model
        const previousMessages = messages.slice(0, -1).map((m: any) => ({
            role: m.role,
            content: m.content,
        }));

        // Free Llama 3 model from huggingface
        // E.g. meta-llama/Meta-Llama-3-8B-Instruct
        // Note: User must have access/token for the specific model if restricted. We will use a general open model like mistral or llama
        const model = process.env.HF_MODEL || "meta-llama/Meta-Llama-3-8B-Instruct";

        // 6. Call HF Inference with streaming
        const stream = hf.chatCompletionStream({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                ...previousMessages,
                { role: "user", content: userQuery }
            ],
            max_tokens: 1024,
            temperature: 0.1,
        });

        // 7. Convert custom async generator to a ReadableStream for the standard API
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const text = chunk.choices[0]?.delta?.content || "";
                    controller.enqueue(new TextEncoder().encode(text));
                }
                controller.close();
            }
        });

        return new Response(readableStream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });

    } catch (error: any) {
        console.error("Chat API error:", error);
        return new Response(error.message || "Something went wrong", { status: 500 });
    }
}
