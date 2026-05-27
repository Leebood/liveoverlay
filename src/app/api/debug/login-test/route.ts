// src/app/api/debug/login-test/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const steps: Record<string, unknown> = {};

    // Step 1: Query user
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, plan_type, auth_provider_id, auth_provider')
      .eq('email', email)
      .maybeSingle();

    steps.step1_query = {
      found: !!data,
      error: error?.message || null,
      authProvider: data?.auth_provider || null,
      hasHashedPassword: !!data?.auth_provider_id,
    };

    if (!data) {
      return NextResponse.json({ success: false, steps, reason: 'USER_NOT_FOUND' });
    }

    // Step 2: Verify password
    const hashedPassword = createHash('sha256').update(password).digest('hex');
    const passwordMatch = data.auth_provider_id === hashedPassword;

    steps.step2_password = {
      inputHash: hashedPassword,
      storedHash: data.auth_provider_id?.substring(0, 8) + '...',
      match: passwordMatch,
      authProvider: data.auth_provider,
    };

    if (!passwordMatch) {
      return NextResponse.json({ success: false, steps, reason: 'PASSWORD_MISMATCH' });
    }

    // Step 3: Try NextAuth signIn programmatically
    steps.step3_nextauth = {
      nextauthUrl: process.env.NEXTAUTH_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      secret: process.env.NEXTAUTH_SECRET ? 'SET (' + process.env.NEXTAUTH_SECRET.length + ' chars)' : 'MISSING',
    };

    return NextResponse.json({ success: true, steps, user: { id: data.id, email: data.email, name: data.name, planType: data.plan_type } });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
