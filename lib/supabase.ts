import { createClient } from "@supabase/supabase-js";

/**
 * Server-side client on the publishable key. RLS lets it insert early-access
 * requests and nothing else, so no secret key is needed here.
 */
export function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set");
  return createClient(url, key, { auth: { persistSession: false } });
}
