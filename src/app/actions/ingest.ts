"use server";
import { revalidatePath } from "next/cache";

import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { pinecone } from "@/lib/pinecone";
import { supabase } from "@/lib/supabase";

export async function processSource(formData: FormData) {
    const url = formData.get("url") as string;
    let botId = formData.get("botId") as string;
    const type = formData.get("type") as "url" | "rss" | "file";
    const textData = formData.get("textData") as string;

    // Mapeo retroactivo para URLs cacheadas
    if (botId === "asistente-politica") botId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    if (botId === "archivos-2023") botId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    if (!url || !botId || !type) {
        throw new Error("Missing required fields");
    }

    // Insert initial record in sources table
    const { data: source, error: insertError } = await supabase
        .from("sources")
        .insert({
            bot_id: botId,
            title: url,
            type: type,
            content_url: url,
            status: "processing",
        })
        .select()
        .single();

    if (insertError || !source) {
        throw new Error(`Error creating source record: ${insertError?.message || "Unknown error"}`);
    }

    const { success, error } = await _ingestSourceData(source, botId, textData);
    
    if (!success) throw new Error(error);

    revalidatePath(`/bot/${botId}`);
    return { success: true, sourceId: source.id };
}

// Internal reusable logic for ingestion and re-indexing
async function _ingestSourceData(source: any, botId: string, textData?: string) {
    const { id: sourceId, content_url: url, type } = source;

    try {
        let extractedText = "";

        if (type === "url") {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch URL");
            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove unwanted and noisy elements
            $('script, style, nav, header, footer, aside, .ad, .menu').remove();

            const titleText = $('#spktitle').text().trim();
            const summaryText = $('#spksumary').text().trim();
            const bodyText = $('.articleBody').text().trim();

            const combinedText = [titleText, summaryText, bodyText].filter(Boolean).join('\n\n');
            extractedText = combinedText.replace(/\s+/g, ' ').trim();
        } else if (type === "rss") {
            const parser = new Parser();
            const feed = await parser.parseURL(url);

            extractedText = feed.items.map((item) => {
                return `Title: ${item.title}\nContent: ${item.contentSnippet || item.content}\nLink: ${item.link}`;
            }).join("\n\n");
        } else if (type === "file") {
            extractedText = textData?.trim() || "";
        }

        if (!extractedText) {
            throw new Error("Could not extract any meaningful text from the source");
        }

        // Initialize Text Splitter (Chunking logic)
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        // Initialize HuggingFace Embeddings
        const embeddings = new HuggingFaceInferenceEmbeddings({
            model: "sentence-transformers/all-MiniLM-L6-v2", // Fast and free HF model
            apiKey: process.env.HUGGINGFACE_API_KEY,
        });

        const chunks = await splitter.splitText(extractedText);

        // Generate embeddings and prepare vectors for Pinecone
        const vectors = await Promise.all(
            chunks.map(async (chunk, i) => {
                const embedding = await embeddings.embedQuery(chunk);
                return {
                    id: `${sourceId}-chunk-${i}`,
                    values: embedding,
                    metadata: {
                        bot_id: botId,
                        source_id: sourceId,
                        url: url,
                        text: chunk, // Storing for retrieval during querying
                    },
                };
            })
        );

        // Upsert into Pinecone using the botId as the isolated Namespace
        const indexName = process.env.PINECONE_INDEX || "chatbots";
        const index = pinecone.Index(indexName);
        const botIndex = index.namespace(botId);

        // Delete old vectors for this source before re-upserting (crucial for re-indexing)
        await botIndex.deleteMany({ filter: { source_id: sourceId } });

        // Split into batches to avoid hitting limits
        const batchSize = 100;
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);
            await botIndex.upsert({ records: batch });
        }

        // Finalize state in Supabase
        await supabase
            .from("sources")
            .update({ status: "completed" })
            .eq("id", sourceId);

        return { success: true };

    } catch (error: any) {
        console.error("Ingestion error:", error);

        // Update status to error if something fails
        await supabase
            .from("sources")
            .update({ status: "error", metadata: { error: String(error) } })
            .eq("id", sourceId);

        return { success: false, error: error.message };
    }
}

export async function reindexSource(sourceId: string, providedBotId: string) {
    if (!sourceId || !providedBotId) throw new Error("Missing parameters");

    let botId = providedBotId;
    if (botId === "asistente-politica") botId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    if (botId === "archivos-2023") botId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    // 1. Get source data
    const { data: source, error: fetchError } = await supabase
        .from("sources")
        .select("*")
        .eq("id", sourceId)
        .single();

    if (fetchError || !source) throw new Error("Source not found");

    // 2. Set to processing
    await supabase
        .from("sources")
        .update({ status: "processing" })
        .eq("id", sourceId);

    revalidatePath(`/bot/${providedBotId}`);

    // 3. Re-run ingestion
    const { success, error } = await _ingestSourceData(source, botId);

    revalidatePath(`/bot/${providedBotId}`);
    
    if (!success) throw new Error(error);
    return { success: true };
}

export async function deleteSource(sourceId: string, providedBotId: string) {
    if (!sourceId || !providedBotId) throw new Error("Missing parameters");

    let botId = providedBotId;
    if (botId === "asistente-politica") botId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    if (botId === "archivos-2023") botId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    try {
        // Delete records from Pinecone that belong to this source
        const indexName = process.env.PINECONE_INDEX || "chatbots";
        const index = pinecone.Index(indexName);
        const botIndex = index.namespace(botId);

        // Deleting by metadata filter (Pinecone allows filtering by metadata since we set source_id)
        // Note: For some serverless Pinecone indexes, deleting by metadata requires a workaround.
        // We will do a robust deleteMany using the filter.
        await botIndex.deleteMany({ filter: { source_id: sourceId } });

        // Delete from Supabase
        const { error } = await supabase
            .from("sources")
            .delete()
            .eq("id", sourceId);

        if (error) throw new Error(error.message);

        revalidatePath(`/bot/${providedBotId}`);
        return { success: true };
    } catch (error: any) {
        console.error("Delete source error:", error);
        throw new Error(error.message || "Failed to delete source");
    }
}
