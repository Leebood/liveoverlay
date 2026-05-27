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

    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (dbErr) {
      const msg = dbErr instanceof Error ? dbErr.message : 'Unknown DB error';
      return NextResponse.json({ 
        error: `数据库连接失败: ${msg}`,
        hint: '请检查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY 环境变量是否正确配置'
      }, { status: 500 });
    }

    // Check if user already exists
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({ 
        error: `查询用户失败: ${selectError.message}`,
        hint: '请确认 users 表已创建，且包含 email 列'
      }, { status: 500 });
    }

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
      return NextResponse.json({ 
        error: `创建用户失败: ${userError.message}`,
        code: userError.code,
        hint: '请确认 users 表包含 id, email, name, auth_provider, auth_provider_id, plan_type 列'
      }, { status: 500 });
    }

    // Create default store for user
    const storeId = uuidv4();
    const slug = email.split('@')[0].replace(/[^a-z0-9]/gi, '-') + '-' + Date.now().toString(36);
    const { error: storeError } = await supabase
      .from('stores')
      .insert({
        id: storeId,
        name: name ? `${name}的店铺` : '我的店铺',
        slug,
        owner_id: userId,
        currency: 'CNY',
        language: 'zh',
      });

    if (storeError) {
      return NextResponse.json({ 
        error: `创建店铺失败: ${storeError.message}`,
        code: storeError.code,
        hint: '请确认 stores 表已创建，且包含 id, name, slug, owner_id, currency, language 列'
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ error: errorMessage, stack: stack?.split('\n').slice(0, 5) }, { status: 500 });
  }
}
