import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
export const SUPABASE_PROJECT_ID = 'pdrxzltydbsrmiapiuct';

function resolveSupabaseUrl(input?: string): string {
  const fallback = 'https://pdrxzltydbsrmiapiuct.supabase.co';
  if (!input || !input.trim()) {
    return fallback;
  }
  const clean = input.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  // When only the project id is passed in env (e.g. "pdrxzltydbsrmiapiuct")
  return `https://${clean}.supabase.co`;
}

export const SUPABASE_URL = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9VgUWVfWjbc2XE5qKhhI5Q_iHCNm026').trim();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
