import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function getSupabaseCredentials(): SupabaseCredentials {
  // Support both COZE_ and NEXT_PUBLIC_ prefixed env vars (Vercel uses NEXT_PUBLIC_)
  const url = process.env.COZE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error('SUPABASE_URL is not set (checked COZE_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL)');
  }
  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY is not set (checked COZE_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }

  return { url, anonKey };
}

function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.COZE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function getSupabaseClient(_token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  // Use service role key for server-side operations (bypasses RLS)
  const serviceRoleKey = getSupabaseServiceRoleKey();
  const key = serviceRoleKey ?? anonKey;

  return createClient(url, key, {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { getSupabaseCredentials, getSupabaseServiceRoleKey, getSupabaseClient };
