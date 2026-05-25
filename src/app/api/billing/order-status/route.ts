// src/app/api/billing/order-status/route.ts
// 查询订单支付状态（前端轮询）

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/billing/order-status?tradeOrderId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tradeOrderId = searchParams.get('tradeOrderId');

    if (!tradeOrderId) {
      return NextResponse.json({ error: '缺少订单号' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // 查询订单
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('id, status, plan_type')
      .eq('stripe_subscription_id', tradeOrderId)
      .maybeSingle();

    if (!subscription) {
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    // 如果已支付，同时查询用户当前计划
    if (subscription.status === 'active') {
      const { data: user } = await supabase
        .from('users')
        .select('plan_type')
        .eq('email', session.user.email)
        .maybeSingle();

      return NextResponse.json({
        status: 'paid',
        planType: user?.plan_type || subscription.plan_type,
      });
    }

    return NextResponse.json({
      status: subscription.status, // pending / active / canceled
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
