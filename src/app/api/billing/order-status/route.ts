// src/app/api/billing/order-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { queryOrder as queryWechatOrder, isWechatPayEnabled, WECHAT_TRADE_STATE } from '@/lib/wechat-pay';
import { queryOrder as queryAlipayOrder, isAlipayEnabled, ALIPAY_TRADE_STATUS } from '@/lib/alipay';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const tradeOrderId = request.nextUrl.searchParams.get('tradeOrderId');
    if (!tradeOrderId) {
      return NextResponse.json({ error: '缺少订单号' }, { status: 400 });
    }

    // 先查数据库中的订阅状态
    const supabase = getSupabaseClient();
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status, payment_method')
      .eq('trade_order_id', tradeOrderId)
      .single();

    if (sub?.status === 'active') {
      return NextResponse.json({ status: 'paid' });
    }

    // 如果微信/支付宝都未配置，检查数据库状态
    const wechatEnabled = isWechatPayEnabled();
    const alipayEnabled = isAlipayEnabled();

    if (!wechatEnabled && !alipayEnabled) {
      // 演示模式，检查数据库
      return NextResponse.json({
        status: sub?.status === 'active' ? 'paid' : 'pending',
      });
    }

    // 根据支付方式查询
    const paymentMethod = sub?.payment_method;

    if (paymentMethod === 'wechat' && wechatEnabled) {
      const result = await queryWechatOrder(tradeOrderId);
      if (result?.trade_state === 'SUCCESS') {
        // 更新数据库
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('trade_order_id', tradeOrderId)
          .eq('status', 'pending');

        return NextResponse.json({ status: 'paid' });
      }
      return NextResponse.json({
        status: 'pending',
        detail: WECHAT_TRADE_STATE[result?.trade_state || 'NOTPAY'] || '等待支付',
      });
    }

    if (paymentMethod === 'alipay' && alipayEnabled) {
      const result = await queryAlipayOrder(tradeOrderId);
      if (result?.tradeStatus === 'TRADE_SUCCESS' || result?.tradeStatus === 'TRADE_FINISHED') {
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('trade_order_id', tradeOrderId)
          .eq('status', 'pending');

        return NextResponse.json({ status: 'paid' });
      }
      return NextResponse.json({
        status: 'pending',
        detail: ALIPAY_TRADE_STATUS[result?.tradeStatus || 'WAIT_BUYER_PAY'] || '等待支付',
      });
    }

    // 回退：检查数据库
    return NextResponse.json({
      status: sub?.status === 'active' ? 'paid' : 'pending',
    });
  } catch (error: unknown) {
    console.error('[OrderStatus] 查询失败:', error);
    return NextResponse.json({ error: '查询订单状态失败' }, { status: 500 });
  }
}
