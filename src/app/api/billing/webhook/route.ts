// src/app/api/billing/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyCallback as verifyWechatCallback, WECHAT_TRADE_STATE } from '@/lib/wechat-pay';
import { verifyCallback as verifyAlipayCallback, ALIPAY_TRADE_STATUS } from '@/lib/alipay';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 微信支付回调
 * POST /api/billing/webhook/wechat
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const channel = pathParts[pathParts.length - 1]; // wechat 或 alipay

    if (channel === 'wechat') {
      return handleWechatCallback(request);
    } else if (channel === 'alipay') {
      return handleAlipayCallback(request);
    }

    // 通用 webhook（兼容旧路径）
    if (contentType.includes('json')) {
      return handleWechatCallback(request);
    } else {
      return handleAlipayCallback(request);
    }
  } catch (error: unknown) {
    console.error('[Webhook] 处理回调失败:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

/**
 * GET /api/billing/webhook/alipay
 * 支付宝使用 GET 方式发送 return_url 回调
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const outTradeNo = params.out_trade_no;
  const tradeStatus = params.trade_status;

  if (outTradeNo && (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED')) {
      const supabase = getSupabaseClient();
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('trade_order_id', outTradeNo)
      .eq('status', 'pending');
  }

  // 重定向到账单页面
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return NextResponse.redirect(`${appUrl}/billing?paid=true`);
}

async function handleWechatCallback(request: NextRequest) {
  const timestamp = request.headers.get('wechatpay-timestamp') || '';
  const nonce = request.headers.get('wechatpay-nonce') || '';
  const signature = request.headers.get('wechatpay-signature') || '';
  const body = await request.text();

  // 验证签名
  const isValid = verifyWechatCallback(timestamp, nonce, body, signature);
  if (!isValid) {
    console.warn('[Webhook/Wechat] 签名验证失败');
  }

  try {
    const data = JSON.parse(body);
    const eventType = data.event_type;
    const resource = data.resource;

    if (eventType === 'TRANSACTION.SUCCESS') {
      const outTradeNo = resource.out_trade_no;
      const tradeState = resource.trade_state;

      if (tradeState === 'SUCCESS' && outTradeNo) {
          const supabase = getSupabaseClient();
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('trade_order_id', outTradeNo)
          .eq('status', 'pending');

        console.log(`[Webhook/Wechat] 订单 ${outTradeNo} 支付成功`);
      }
    }

    // 微信要求返回 200 + 成功响应
    return NextResponse.json({ code: 'SUCCESS', message: 'OK' });
  } catch {
    return NextResponse.json({ code: 'FAIL', message: 'Invalid data' }, { status: 400 });
  }
}

async function handleAlipayCallback(request: NextRequest) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  // 验证签名
  const isValid = verifyAlipayCallback(params);
  if (!isValid) {
    console.warn('[Webhook/Alipay] 签名验证失败');
    return new Response('fail', { status: 400 });
  }

  const outTradeNo = params.out_trade_no;
  const tradeStatus = params.trade_status;

  if ((tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') && outTradeNo) {
      const supabase = getSupabaseClient();
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('trade_order_id', outTradeNo)
      .eq('status', 'pending');

    console.log(`[Webhook/Alipay] 订单 ${outTradeNo} 支付成功`);
  }

  // 支付宝要求返回 success 字符串
  return new Response('success');
}
