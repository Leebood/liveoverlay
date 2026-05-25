// src/app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createNativeOrder, isWechatPayEnabled } from '@/lib/wechat-pay';
import { createPrecreateOrder, createPagePayOrder, isAlipayEnabled } from '@/lib/alipay';
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
      paymentMethod: 'wechat' | 'alipay';
    };

    const { planType, billingPeriod, paymentMethod } = body;
    const limits = getPlanLimits(planType);

    if (limits.price === 0) {
      return NextResponse.json({ error: '免费计划无需支付' }, { status: 400 });
    }

    // 计算金额
    const amount = billingPeriod === 'yearly' ? limits.yearlyPriceCNY : limits.priceCNY;
    const description = `LiveOverlay ${limits.displayName} - ${billingPeriod === 'yearly' ? '年付' : '月付'}`;

    // 检查支付方式是否可用
    const wechatEnabled = isWechatPayEnabled();
    const alipayEnabled = isAlipayEnabled();

    // 如果两者都未配置，进入演示模式
    if (!wechatEnabled && !alipayEnabled) {
      const supabase = getSupabaseClient();
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: 'demo-user',
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
        message: '演示模式：支付未配置，计划已直接切换',
      });
    }

    // 检查选择的支付方式是否已启用
    if (paymentMethod === 'wechat' && !wechatEnabled) {
      return NextResponse.json({ error: '微信支付未配置，请使用支付宝或联系管理员' }, { status: 400 });
    }
    if (paymentMethod === 'alipay' && !alipayEnabled) {
      return NextResponse.json({ error: '支付宝未配置，请使用微信支付或联系管理员' }, { status: 400 });
    }

    const orderId = generateOrderId();

    // 保存订单到数据库
    const supabase = getSupabaseClient();
    await supabase.from('subscriptions').upsert({
      user_id: 'demo-user',
      plan_type: planType,
      billing_period: billingPeriod,
      status: 'pending',
      trade_order_id: orderId,
      payment_method: paymentMethod,
      amount: amount,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + (billingPeriod === 'yearly' ? 365 : 30) * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // 创建支付订单
    if (paymentMethod === 'wechat') {
      // 微信支付：Native 扫码支付
      const result = await createNativeOrder(orderId, amount, description);
      if (!result?.code_url) {
        return NextResponse.json({ error: '微信支付订单创建失败' }, { status: 500 });
      }
      return NextResponse.json({
        qrCodeUrl: result.code_url,
        tradeOrderId: orderId,
        channel: 'wechat',
        amount: amount.toString(),
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
        });
      }

      return NextResponse.json({ error: '支付宝订单创建失败' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('[Checkout] 创建支付订单失败:', error);
    const msg = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
