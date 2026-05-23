// src/lib/supabase.ts
// Re-export the unified Supabase client from storage/database

export { getSupabaseClient, getSupabaseCredentials } from '@/storage/database/supabase-client';

export function getSupabaseServerClient() {
  // Use service role key for server-side operations (no RLS)
  const { getSupabaseClient } = require('@/storage/database/supabase-client') as typeof import('@/storage/database/supabase-client');
  return getSupabaseClient();
}

export function getSupabaseBrowserClient() {
  // Use anon key for browser-side operations (with RLS)
  const { getSupabaseClient } = require('@/storage/database/supabase-client') as typeof import('@/storage/database/supabase-client');
  return getSupabaseClient('');
}

export function getControlChannel(storeId: string): string {
  return `store_${storeId}_overlay`;
}
