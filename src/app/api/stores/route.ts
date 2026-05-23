// src/app/api/stores/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/stores — 获取当前用户的所有店铺
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const userId = (session.user as unknown as Record<string, unknown>).id as string;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      return NextResponse.json({ error: '查询店铺失败，请稍后再试' }, { status: 500 });
    }

    // 如果用户还没有店铺，自动创建一个默认店铺
    if (!data || data.length === 0) {
      const userName = (session.user as unknown as Record<string, unknown>).name as string || '用户';
      const slug = `${userName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).slice(2, 8)}`;

      const { data: newStore, error: createError } = await supabase
        .from('stores')
        .insert({
          name: `${userName}的店铺`,
          slug,
          owner_id: userId,
          currency: 'USD',
          language: 'zh',
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: '创建默认店铺失败，请稍后再试' }, { status: 500 });
      }

      return NextResponse.json({ stores: [newStore], currentStore: newStore });
    }

    return NextResponse.json({ stores: data, currentStore: data[0] });
  } catch {
    return NextResponse.json({ error: '服务器错误，请稍后再试' }, { status: 500 });
  }
}
