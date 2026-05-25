// src/app/api/billing/cancel/route.ts
// 取消订阅

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isXunhuPayConfigured } from '@/lib/xunhupay';

// POST /api/billing/cancel
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const supabase = getSupabaseClient();
    const { data: user } = await supabase
      .from('users')
      .select('id, plan_type')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    if (user.plan_type === 'free') {
      return NextResponse.json({ error: '当前为免费计划' }, { status: 400 });
    }

    // 更新用户计划为免费
    await supabase
      .from('users')
      .update({
        plan_type: 'free',
        subscription_status: 'canceled',
      })
      .eq('id', user.id);

    // 更新订阅状态
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    return NextResponse.json({
      success: true,
      message: '订阅已取消，计划已降级为免费版',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
