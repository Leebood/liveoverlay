// src/app/api/billing/checkout/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getPlanLimits } from '@/lib/plan-limits';
import { isXunhuPayConfigured, createPayment, type PaymentChannel } from '@/lib/xunhupay';
import type { PlanType } from '@/types/plan';

// POST /api/billing/checkout
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { planType, billingPeriod, paymentMethod } = (await request.json()) as {
      planType: string;
      billingPeriod: string;
      paymentMethod?: string;
    };

    if (!planType || !billingPeriod) {
      return NextResponse.json({ error: 'planType and billingPeriod are required' }, { status: 400 });
    }

    if (planType === 'free') {
      return NextResponse.json({ error: '免费计划无需支付' }, { status: 400 });
    }

    const plan = getPlanLimits(planType as PlanType);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, plan_type')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';

    // ─── 虎皮椒支付模式 ───
    if (isXunhuPayConfigured()) {
      // 确定支付渠道
      let channel: PaymentChannel = 'wechat';
      if (paymentMethod === 'alipay') {
        channel = 'alipay';
      }

      // 计算金额（人民币，单位：元）
      const price = billingPeriod === 'yearly' ? plan.yearlyPriceCNY : plan.priceCNY;
      const totalFee = price.toFixed(2);

      // 生成唯一订单号
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const tradeOrderId = `LO_${planType}_${billingPeriod}_${timestamp}_${random}`;

      // 订单标题
      const periodText = billingPeriod === 'yearly' ? '年付' : '月付';
      const title = `LiveOverlay ${plan.displayName} ${periodText}`;

      const result = await createPayment({
        tradeOrderId,
        totalFee,
        title,
        channel,
        notifyUrl: `${appUrl}/api/billing/webhook`,
        returnUrl: `${appUrl}/billing?success=true`,
        type: 'native', // 扫码支付
        userId: user.id,
      });

      // 保存订单信息到数据库
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_subscription_id: tradeOrderId, // 复用字段存储订单号
          stripe_customer_id: channel,          // 复用字段存储支付渠道
          plan_type: planType,
          status: 'pending',
          current_period_start: new Date().toISOString(),
          current_period_end: billingPeriod === 'yearly'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      return NextResponse.json({
        qrCodeUrl: result.url_qrcode,
        payUrl: result.url,
        tradeOrderId,
        channel,
        amount: totalFee,
      });
    }

    // ─── 演示模式（未配置支付密钥）───
    await supabase
      .from('users')
      .update({
        plan_type: planType,
        subscription_status: 'active',
      })
      .eq('id', user.id);

    return NextResponse.json({
      url: `/billing?success=true&demo=true`,
      demo: true,
      message: '演示模式：计划已直接切换',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
