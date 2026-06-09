// src/app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createNativeOrder, isWechatPayEnabled } from '@/lib/wechat-pay';
import { createPrecreateOrder, createPagePayOrder, isAlipayEnabled } from '@/lib/alipay';
import { createCreemCheckout, isCreemEnabled } from '@/lib/creem';
import { getPlanLimits } from '@/lib/plan-limits';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { PlanType } from '@/types/plan';

/** 生成订单号 */
function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LO${ts}${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      planType: PlanType;
      billingPeriod: 'monthly' | 'yearly';
      paymentMethod: 'wechat' | 'alipay' | 'creem';
    };

    const { planType, billingPeriod, paymentMethod } = body;
    const limits = getPlanLimits(planType);

    if (limits.price === 0) {
      return NextResponse.json({ error: 'Free plan requires no payment' }, { status: 400 });
    }

    // 检查支付方式是否可用
    const wechatEnabled = isWechatPayEnabled();
    const alipayEnabled = isAlipayEnabled();
    const creemEnabled = isCreemEnabled();

    // 如果三者都未配置，进入演示模式
    if (!wechatEnabled && !alipayEnabled && !creemEnabled) {
      const supabase = getSupabaseClient();
      const session = await getServerSession();
      const userId = (session?.user as Record<string, unknown> | undefined)?.id
        ? String((session?.user as Record<string, unknown>).id)
        : 'demo-user';
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: planType,
          billing_period: billingPeriod,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (billingPeriod === 'yearly' ? 365 : 30) * 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        });

      return NextResponse.json({
        demo: true,
        planType,
        message: 'Demo mode: payment not configured, plan switched directly',
      });
    }

    // 检查选择的支付方式是否已启用
    if (paymentMethod === 'wechat' && !wechatEnabled) {
      return NextResponse.json({ error: 'WeChat Pay not configured' }, { status: 400 });
    }
    if (paymentMethod === 'alipay') {
      return NextResponse.json({ error: 'Alipay payment is no longer supported, please use WeChat Pay or Creem' }, { status: 400 });
    }
    if (paymentMethod === 'creem' && !creemEnabled) {
      return NextResponse.json({ error: 'Creem not configured' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const supabase = getSupabaseClient();
    const session = await getServerSession();
    const userId = (session?.user as Record<string, unknown> | undefined)?.id
      ? String((session?.user as Record<string, unknown>).id)
      : 'demo-user';
    const userEmail = (session?.user as Record<string, unknown> | undefined)?.email
      ? String((session?.user as Record<string, unknown>).email)
      : undefined;

    // Creem 使用 USD，微信/支付宝使用 CNY
    const isCreem = paymentMethod === 'creem';
    const amount = isCreem
      ? (billingPeriod === 'yearly' ? limits.yearlyPrice : limits.price)
      : (billingPeriod === 'yearly' ? limits.yearlyPriceCNY : limits.priceCNY);
    const currency = isCreem ? 'USD' : 'CNY';
    const description = `LiveOverlay ${limits.displayName} - ${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}`;

    // 保存订单到数据库
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan_type: planType,
      billing_period: billingPeriod,
      status: 'pending',
      trade_order_id: orderId,
      payment_method: paymentMethod,
      amount: amount,
      currency: currency,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + (billingPeriod === 'yearly' ? 365 : 30) * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // 创建支付订单
    if (paymentMethod === 'creem') {
      // Creem 支付
      const result = await createCreemCheckout({
        planType,
        billingPeriod,
        orderId,
        customer: { email: userEmail },
        metadata: { userId, planType, billingPeriod, orderId },
      });
      if (!result) {
        return NextResponse.json({ error: 'Creem checkout creation failed' }, { status: 500 });
      }
      if (!result.checkoutUrl) {
        return NextResponse.json({ error: 'Creem returned empty checkout URL' }, { status: 500 });
      }
      return NextResponse.json({
        checkoutUrl: result.checkoutUrl,
        checkoutId: result.id,
        tradeOrderId: orderId,
        channel: 'creem',
        currency: 'USD',
      });
    } else if (paymentMethod === 'wechat') {
      // 微信支付：Native 扫码支付
      const result = await createNativeOrder(orderId, amount, description);
      if (!result?.code_url) {
        return NextResponse.json({ error: 'WeChat Pay order creation failed' }, { status: 500 });
      }
      return NextResponse.json({
        qrCodeUrl: result.code_url,
        tradeOrderId: orderId,
        channel: 'wechat',
        amount: amount.toString(),
        currency: currency,
      });
    } else {
      // 支付宝：扫码支付（优先）或页面支付
      const qrResult = await createPrecreateOrder(orderId, amount, description);
      if (qrResult) {
        return NextResponse.json({
          qrCodeUrl: qrResult,
          tradeOrderId: orderId,
          channel: 'alipay',
          amount: amount.toString(),
          currency: currency,
        });
      }

      // 回退到页面支付
      const pageUrl = await createPagePayOrder(orderId, amount, description);
      if (pageUrl) {
        return NextResponse.json({
          url: pageUrl,
          tradeOrderId: orderId,
          channel: 'alipay',
          amount: amount.toString(),
          currency: currency,
        });
      }

      return NextResponse.json({ error: 'Alipay order creation failed' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('[Checkout] Payment order creation failed:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
