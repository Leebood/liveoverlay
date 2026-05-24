// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string };
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
    }

    // Hash password (simple SHA-256 for demo; use bcrypt in production)
    const hashedPassword = createHash('sha256').update(password).digest('hex');

    // Create user
    const userId = uuidv4();
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        auth_provider: 'email',
        auth_provider_id: hashedPassword,
        plan_type: 'free',
      });

    if (userError) {
      // Handle duplicate key constraint
      if (userError.message.includes('unique') || userError.message.includes('duplicate')) {
        return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
      }
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create default store for user
    const storeId = uuidv4();
    const slug = email.split('@')[0].replace(/[^a-z0-9]/gi, '-') + '-' + Date.now().toString(36);
    await supabase
      .from('stores')
      .insert({
        id: storeId,
        name: name ? `${name}的店铺` : '我的店铺',
        slug,
        owner_id: userId,
        currency: 'USD',
        language: 'zh',
      });

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ error: errorMessage, stack: stack?.split('\n').slice(0, 5) }, { status: 500 });
  }
}
