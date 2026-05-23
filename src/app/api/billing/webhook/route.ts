// src/app/api/billing/webhook/route.ts

import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isStripeConfigured, getStripeClient } from '@/lib/stripe';

// POST /api/billing/webhook
export async function POST(request: Request) {
  try {
    // Demo mode: no Stripe configured
    if (!isStripeConfigured()) {
      return NextResponse.json({ received: true, demo: true });
    }

    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: import('stripe').Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const cs = event.data.object as import('stripe').Stripe.Checkout.Session;
        if (cs.metadata?.userId && cs.metadata?.planType) {
          await supabase
            .from('users')
            .update({
              plan_type: cs.metadata.planType,
              subscription_status: 'active',
              stripe_subscription_id: cs.subscription as string,
            })
            .eq('id', cs.metadata.userId);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as import('stripe').Stripe.Subscription;
        await supabase
          .from('users')
          .update({
            plan_type: 'free',
            subscription_status: 'canceled',
          })
          .eq('stripe_customer_id', sub.customer as string);
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as import('stripe').Stripe.Subscription;
        const status = sub.status === 'active' ? 'active' : 'inactive';
        await supabase
          .from('users')
          .update({
            subscription_status: status,
          })
          .eq('stripe_customer_id', sub.customer as string);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
