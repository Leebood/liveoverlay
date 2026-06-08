// src/app/api/billing/webhook/creem/route.ts
// Creem Webhook 回调处理
// 文档：https://docs.creem.io/learn/webhooks

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Creem } from '@/lib/creem';

const SUPABASE_URL =
  process.env.COZE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';
const SUPABASE_SERVICE_KEY =
  process.env.COZE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

function getSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

interface CreemWebhookEvent {
  id: string;
  type: string;
  data: {
    id: string;
    status: string;
    metadata?: Record<string, string>;
    customer?: { email?: string };
    product?: { id: string; name?: string };
    amount?: number;
    currency?: string;
  };
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('creem-signature') || request.headers.get('x-creem-signature') || '';
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET || '';

  const body = await request.text();

  // 验证签名（如果有配置 webhook secret）
  if (webhookSecret && signature) {
    if (!Creem.verifyWebhook(body, signature, webhookSecret)) {
      console.error('[Creem Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: CreemWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('[Creem Webhook] Event received:', event.type, event.id);

  try {
    const supabase = getSupabase();

    // 处理订阅激活事件
    // Creem 的事件类型：checkout.completed, subscription.created, subscription.updated, etc.
    if (
      event.type === 'checkout.completed' ||
      event.type === 'subscription.created' ||
      event.type === 'subscription.active' ||
      event.type === 'subscription.paid'
    ) {
      const userId = event.data.metadata?.userId;
      const planType = event.data.metadata?.planType;
      const billingCycle = event.data.metadata?.billingCycle || 'monthly';

      if (userId && planType) {
        // 计算订阅到期时间
        const now = new Date();
        const expiresAt = new Date(now);
        if (billingCycle === 'yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        // 更新用户计划
        const { error: updateError } = await supabase
          .from('users')
          .update({
            plan_type: planType,
            subscription_status: 'active',
            subscription_started_at: now.toISOString(),
            subscription_expires_at: expiresAt.toISOString(),
            subscription_provider: 'creem',
            subscription_external_id: event.data.id,
          })
          .eq('id', userId);

        if (updateError) {
          console.error('[Creem Webhook] User update failed:', updateError);
        } else {
          console.log('[Creem Webhook] User updated:', userId, '->', planType);
        }

        // 记录支付事件
        await supabase.from('payment_events').insert({
          user_id: userId,
          provider: 'creem',
          event_type: event.type,
          checkout_id: event.data.id,
          plan_type: planType,
          amount: event.data.amount || 0,
          currency: event.data.currency || 'USD',
          status: 'completed',
          metadata: event.data.metadata,
          created_at: new Date().toISOString(),
        });
      } else {
        console.warn('[Creem Webhook] Missing userId/planType in metadata');
      }
    } else if (
      event.type === 'subscription.cancelled' ||
      event.type === 'subscription.expired'
    ) {
      const userId = event.data.metadata?.userId;
      if (userId) {
        await supabase
          .from('users')
          .update({
            subscription_status: 'cancelled',
            subscription_expires_at: new Date().toISOString(),
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Creem Webhook] Processing error:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Creem webhook endpoint active' });
}
