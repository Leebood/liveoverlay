// src/app/api/health/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, { status: string; detail?: string }> = {};

  // Check ALL environment variables
  const envVars = [
    'COZE_SUPABASE_URL',
    'COZE_SUPABASE_ANON_KEY',
    'COZE_SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_APP_URL',
  ];

  for (const v of envVars) {
    const val = process.env[v];
    checks[v] = {
      status: val ? 'SET' : 'MISSING',
      detail: val ? `${val.substring(0, 15)}...` : undefined,
    };
  }

  // Test Supabase connection
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('users').select('id').limit(1);
    checks['supabase_connection'] = {
      status: error ? 'ERROR' : 'OK',
      detail: error ? error.message : `${data?.length ?? 0} rows`,
    };
  } catch (err) {
    checks['supabase_connection'] = {
      status: 'FAILED',
      detail: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  // Check users table columns (the ones auth actually needs)
  const requiredColumns = ['id', 'email', 'name', 'plan_type', 'auth_provider_id', 'auth_provider', 'image'];
  for (const col of requiredColumns) {
    try {
      const { getSupabaseClient } = await import('@/storage/database/supabase-client');
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('users').select(col).limit(1);
      checks[`users.${col}`] = {
        status: error ? 'MISSING' : 'OK',
        detail: error ? error.message : undefined,
      };
    } catch (err) {
      checks[`users.${col}`] = {
        status: 'ERROR',
        detail: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  // Check stores table
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('stores').select('id').limit(1);
    checks['stores_table'] = {
      status: error ? 'ERROR' : 'OK',
      detail: error ? error.message : `${data?.length ?? 0} stores`,
    };
  } catch (err) {
    checks['stores_table'] = {
      status: 'ERROR',
      detail: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  // Check products table
  try {
    const { getSupabaseClient } = await import('@/storage/database/supabase-client');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('products').select('id').limit(1);
    checks['products_table'] = {
      status: error ? 'ERROR' : 'OK',
      detail: error ? error.message : `${data?.length ?? 0} products`,
    };
  } catch (err) {
    checks['products_table'] = {
      status: 'ERROR',
      detail: err instanceof Error ? err.message : 'Unknown error',
    };
  }

  const allOk = Object.values(checks).every(c => c.status === 'OK' || c.status === 'SET');

  return NextResponse.json({ healthy: allOk, checks }, { status: allOk ? 200 : 500 });
}
