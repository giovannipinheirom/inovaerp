import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Cria um cliente Supabase para uso em Client Components (browser).
 * Ideal para interações em tempo real e operações do lado do cliente.
 */
export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
