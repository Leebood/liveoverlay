// src/app/api/billing/paypal-capture/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { capturePaypalOrder } from '@/lib/paypal';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * POST /api/billing/paypal-capture
 * PayPal 前端捕获订单（用户在 PayPal 页面批准后调用）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      paypalOrderId: string;
      tradeOrderId: string;
    };

    const { paypalOrderId, tradeOrderId } = body;

    if (!paypalOrderId || !tradeOrderId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Capture the PayPal order
    const result = await capturePaypalOrder(paypalOrderId);

    if (!result?.success) {
      return NextResponse.json({ error: 'PayPal capture failed' }, { status: 500 });
    }

    // Update subscription status
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('trade_order_id', tradeOrderId)
      .eq('status', 'pending');

    if (error) {
      console.error('[PayPal Capture] DB update failed:', error);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    console.log(`[PayPal Capture] Order ${tradeOrderId} payment captured and activated`);

    return NextResponse.json({
      success: true,
      tradeOrderId,
      message: 'Payment captured successfully',
    });
  } catch (error: unknown) {
    console.error('[PayPal Capture] Failed:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
