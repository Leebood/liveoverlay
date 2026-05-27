// src/app/api/debug/auth/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: string; email?: string; password?: string };
    const { action, email, password } = body;

    if (action === 'register') {
      if (!email || !password) {
        return NextResponse.json({ error: 'email and password required' }, { status: 400 });
      }

      const { getSupabaseClient } = await import('@/storage/database/supabase-client');
      const { v4: uuidv4 } = await import('uuid');
      const { createHash } = await import('crypto');

      const supabase = getSupabaseClient();

      // Check existing
      const { data: existing, error: selectErr } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (selectErr) {
        return NextResponse.json({ step: 'check_existing', error: selectErr.message, code: selectErr.code });
      }

      if (existing) {
        return NextResponse.json({ step: 'check_existing', message: 'User already exists', userId: existing.id });
      }

      // Insert user
      const hashedPassword = createHash('sha256').update(password).digest('hex');
      const userId = uuidv4();

      const { error: insertErr } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          name: email.split('@')[0],
          auth_provider: 'email',
          auth_provider_id: hashedPassword,
          plan_type: 'free',
        });

      if (insertErr) {
        return NextResponse.json({ step: 'insert_user', error: insertErr.message, code: insertErr.code });
      }

      // Create store
      const storeId = uuidv4();
      const slug = email.split('@')[0].replace(/[^a-z0-9]/gi, '-') + '-' + Date.now().toString(36);
      const { error: storeErr } = await supabase
        .from('stores')
        .insert({
          id: storeId,
          name: '我的店铺',
          slug,
          owner_id: userId,
          currency: 'CNY',
          language: 'zh',
        });

      if (storeErr) {
        return NextResponse.json({ step: 'insert_store', error: storeErr.message, code: storeErr.code });
      }

      return NextResponse.json({ success: true, userId, storeId });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'email and password required' }, { status: 400 });
      }

      const { getSupabaseClient } = await import('@/storage/database/supabase-client');
      const { createHash } = await import('crypto');

      const supabase = getSupabaseClient();
      const hashedPassword = createHash('sha256').update(password).digest('hex');

      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, plan_type, auth_provider_id, auth_provider')
        .eq('email', email)
        .eq('auth_provider', 'email')
        .maybeSingle();

      if (error) {
        return NextResponse.json({ step: 'query_user', error: error.message, code: error.code });
      }

      if (!data) {
        return NextResponse.json({ step: 'query_user', message: 'User not found', email });
      }

      if (data.auth_provider_id !== hashedPassword) {
        return NextResponse.json({ step: 'verify_password', message: 'Password mismatch', expected: hashedPassword.substring(0, 8) + '...', got: data.auth_provider_id.substring(0, 8) + '...' });
      }

      return NextResponse.json({ success: true, user: { id: data.id, email: data.email, name: data.name, planType: data.plan_type } });
    }

    if (action === 'check-session') {
      const { getServerSession } = await import('next-auth');
      const authOptions = (await import('@/lib/auth')).default;
      const session = await getServerSession(authOptions);
      return NextResponse.json({ session });
    }

    return NextResponse.json({ error: 'Unknown action. Use: register, login, check-session' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack?.split('\n').slice(0, 5) : undefined,
    }, { status: 500 });
  }
}
