"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBot(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const systemPrompt = formData.get("systemPrompt") as string;

  if (!name || !systemPrompt) {
    throw new Error("Nombre e Instrucciones son obligatorios.");
  }

  const { data: bot, error } = await supabase
    .from("bots")
    .insert({
      name,
      description,
      system_prompt: systemPrompt,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bot:", error);
    throw new Error("No se pudo crear el bot: " + error.message);
  }

  revalidatePath("/");
  redirect(`/bot/${bot.id}`);
}

export async function updateBot(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const systemPrompt = formData.get("systemPrompt") as string;

  const { error } = await supabase
    .from("bots")
    .update({
      name,
      description,
      system_prompt: systemPrompt,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating bot:", error);
    throw new Error("No se pudo actualizar el bot");
  }

  revalidatePath(`/bot/${id}`);
}
