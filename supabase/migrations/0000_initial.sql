-- DROP existing tables to start fresh
DROP TABLE IF EXISTS public.chats CASCADE;
DROP TABLE IF EXISTS public.sources CASCADE;
DROP TABLE IF EXISTS public.bots CASCADE;

-- Table: bots
CREATE TABLE public.bots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  system_prompt text,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  color text DEFAULT '#0070D7',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Table: sources
CREATE TABLE public.sources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id uuid REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'url', 'rss')),
  content_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Table: chats
CREATE TABLE public.chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id uuid REFERENCES public.bots(id) ON DELETE CASCADE NOT NULL,
  title text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- INSERT INITIAL MOCK DATA
-- These UUIDs match the ones used in the Dashboard UI
INSERT INTO public.bots (id, name, description, system_prompt) 
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Asistente de Política', 'Bot entrenado con noticias políticas y diarios oficiales.', 'Eres un asistente experto en política y periodismo. Responde estrictamente usando el contexto proporcionado.'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Archivos 2023', 'Archivo histórico de noticias del año 2023.', 'Eres un bibliotecario especializado en historia periodística del 2023. Tus respuestas deben ser sumamente formales.');
