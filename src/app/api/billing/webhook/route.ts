// src/app/api/billing/webhook/route.ts
// 虎皮椒异步回调通知

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isXunhuPayConfigured, verifyCallback } from '@/lib/xunhupay';

// POST /api/billing/webhook
export async function POST(request: Request) {
  try {
    if (!isXunhuPayConfigured()) {
      return NextResponse.json({ errcode: 0, errmsg: 'demo mode' });
    }

    const formData = await request.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证签名
    if (!verifyCallback(params)) {
      return NextResponse.json({ errcode: 1, errmsg: '签名验证失败' }, { status: 400 });
    }

    // 支付状态: OD（订单已支付）
    const status = params.status || params.trade_status;
    const tradeOrderId = params.trade_order_id || params.out_trade_no;

    if (status === 'OD' && tradeOrderId) {
      const supabase = getSupabaseClient();

      // 查找订单
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan_type')
        .eq('stripe_subscription_id', tradeOrderId)
        .maybeSingle();

      if (subscription) {
        // 更新订单状态为已支付
        await supabase
          .from('subscriptions')
          .update({ status: 'active' })
          .eq('id', subscription.id);

        // 更新用户计划
        if (subscription.user_id && subscription.plan_type) {
          await supabase
            .from('users')
            .update({
              plan_type: subscription.plan_type,
              subscription_status: 'active',
            })
            .eq('id', subscription.user_id);
        }
      }
    }

    // 返回成功响应（虎皮椒要求返回 errcode=0）
    return NextResponse.json({ errcode: 0, errmsg: 'success' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ errcode: 1, errmsg: message }, { status: 500 });
  }
}
