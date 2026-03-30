"use server";

import { supabase } from "@/lib/supabase";

export async function createChat(botId: string, title?: string) {
    const { data, error } = await supabase
        .from('chats')
        .insert({
            bot_id: botId,
            title: title || "Conversación Nueva"
        })
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function getChatHistory(botId: string) {
    // Get all chats for this bot with their latest messages
    const { data: chats, error } = await supabase
        .from('chats')
        .select(`
            id, 
            title, 
            updated_at,
            messages (
                id, 
                role, 
                content, 
                created_at
            )
        `)
        .eq('bot_id', botId)
        .order('updated_at', { ascending: false });

    if (error) throw error;
    return chats;
}
