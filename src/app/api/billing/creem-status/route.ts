// src/app/api/billing/creem-status/route.ts
// 查询 Creem 订单状态

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCreemCheckout } from '@/lib/creem';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as Record<string, unknown> | undefined;
  if (!sessionUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = String(sessionUser.id);

  const body = await request.json() as { checkoutId?: string };
  const checkoutId = body.checkoutId;
  if (!checkoutId) {
    return NextResponse.json({ error: 'Missing checkoutId' }, { status: 400 });
  }

  if (!process.env.CREEM_API_KEY) {
    return NextResponse.json({ error: 'Creem not configured' }, { status: 500 });
  }

  try {
    const checkout = await getCreemCheckout(checkoutId);
    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
    }

    const isPaid = checkout.status === 'completed' || checkout.status === 'paid';

    // 如果已支付且 metadata 匹配当前用户，更新订阅状态
    if (isPaid && checkout.metadata?.userId === userId) {
      const planType = checkout.metadata.planType;
      const billingPeriod = checkout.metadata.billingPeriod || 'monthly';
      if (planType) {
        const supabase = getSupabaseClient();
        const now = new Date();
        const expiresAt = new Date(now);
        if (billingPeriod === 'yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paid_at: now.toISOString(),
            current_period_end: expiresAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('user_id', userId)
          .eq('trade_order_id', checkout.metadata.orderId);
      }
    }

    return NextResponse.json({
      success: true,
      status: isPaid ? 'paid' : checkout.status,
      paid: isPaid,
      metadata: checkout.metadata,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Creem Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to query', detail: msg },
      { status: 500 },
    );
  }
}
