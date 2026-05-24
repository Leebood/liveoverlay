// src/app/api/health/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, { status: string; detail?: string }> = {};

  // Check environment variables
  const envVars = [
    'COZE_SUPABASE_URL',
    'COZE_SUPABASE_ANON_KEY',
    'COZE_SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  for (const v of envVars) {
    const val = process.env[v];
    checks[v] = {
      status: val ? 'SET' : 'MISSING',
      detail: val ? `${val.substring(0, 10)}...` : undefined,
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

  const allOk = Object.values(checks).every(c => c.status === 'OK' || c.status === 'SET');

  return NextResponse.json({ healthy: allOk, checks }, { status: allOk ? 200 : 500 });
}
