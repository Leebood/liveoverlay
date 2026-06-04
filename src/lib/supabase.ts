// src/lib/supabase.ts
// Re-export the unified Supabase client from storage/database

import { createClient } from '@supabase/supabase-js';
import {
  getSupabaseClient,
  getSupabaseCredentials,
} from '@/storage/database/supabase-client';

export { getSupabaseClient, getSupabaseCredentials };

export function getSupabaseServerClient() {
  // Use service role key for server-side operations (no RLS)
  return getSupabaseClient();
}

export function getSupabaseBrowserClient() {
  // Use anon key for browser-side operations (with RLS)
  const { url, anonKey } = getSupabaseCredentials();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

export function getControlChannel(storeId: string): string {
  return `store_${storeId}_overlay`;
}
