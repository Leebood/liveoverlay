// src/app/api/billing/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyCallback as verifyWechatCallback } from '@/lib/wechat-pay';
import { verifyCallback as verifyAlipayCallback } from '@/lib/alipay';
import { capturePaypalOrder, verifyPaypalWebhook } from '@/lib/paypal';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * POST /api/billing/webhook/wechat
 * POST /api/billing/webhook/alipay
 * POST /api/billing/webhook/paypal
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const channel = pathParts[pathParts.length - 1];

    if (channel === 'paypal') {
      return handlePaypalCallback(request);
    } else if (channel === 'wechat') {
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
    console.error('[Webhook] Processing failed:', error);
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return NextResponse.redirect(`${appUrl}/billing?paid=true`);
}

async function handlePaypalCallback(request: NextRequest) {
  const body = await request.text();
  const headers: Record<string, string> = {
    'paypal-auth-algo': request.headers.get('paypal-auth-algo') || '',
    'paypal-cert-url': request.headers.get('paypal-cert-url') || '',
    'paypal-transmission-id': request.headers.get('paypal-transmission-id') || '',
    'paypal-transmission-sig': request.headers.get('paypal-transmission-sig') || '',
    'paypal-transmission-time': request.headers.get('paypal-transmission-time') || '',
  };

  try {
    const isValid = await verifyPaypalWebhook(headers, body);
    if (!isValid) {
      console.warn('[Webhook/PayPal] Signature verification failed');
      return NextResponse.json({ error: 'Invalid PayPal webhook signature' }, { status: 400 });
    }

    const data = JSON.parse(body);
    const eventType = data.event_type;

    // PayPal webhook events
    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
      const paypalOrderId = data.resource?.id;
      if (paypalOrderId) {
        // Capture the order
        const captureResult = await capturePaypalOrder(paypalOrderId);
        if (captureResult?.success) {
          const customId = captureResult.customId;
          if (customId) {
            const supabase = getSupabaseClient();
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('trade_order_id', customId)
              .eq('payment_method', 'paypal')
              .eq('status', 'pending');

            console.log(`[Webhook/PayPal] Order ${customId} payment successful`);
          }
        }
      }
    } else if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      // Fallback: capture completed directly
      const customId = data.resource?.custom_id;
      if (customId) {
        const supabase = getSupabaseClient();
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('trade_order_id', customId)
          .eq('payment_method', 'paypal')
          .eq('status', 'pending');

        console.log(`[Webhook/PayPal] Capture ${customId} completed`);
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

async function handleWechatCallback(request: NextRequest) {
  const timestamp = request.headers.get('wechatpay-timestamp') || '';
  const nonce = request.headers.get('wechatpay-nonce') || '';
  const signature = request.headers.get('wechatpay-signature') || '';
  const body = await request.text();

  const headers: Record<string, string> = {
    'wechatpay-timestamp': timestamp,
    'wechatpay-nonce': nonce,
    'wechatpay-signature': signature,
  };
  const verifyResult = await verifyWechatCallback(body, headers);
  if (!verifyResult.success) {
    console.warn('[Webhook/Wechat] Signature verification failed');
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

        console.log(`[Webhook/Wechat] Order ${outTradeNo} payment successful`);
      }
    }

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

  const isValid = verifyAlipayCallback(params);
  if (!isValid) {
    console.warn('[Webhook/Alipay] Signature verification failed');
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

    console.log(`[Webhook/Alipay] Order ${outTradeNo} payment successful`);
  }

  return new Response('success');
}
