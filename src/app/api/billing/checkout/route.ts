// src/app/api/billing/checkout/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { getPlanLimits } from '@/lib/plan-limits';
import { isStripeConfigured, getStripeClient } from '@/lib/stripe';
import type { PlanType } from '@/types/plan';

// POST /api/billing/checkout
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, billingPeriod, paymentMethod } = (await request.json()) as {
      planType: string;
      billingPeriod: string;
      paymentMethod?: string;
    };

    if (!planType || !billingPeriod) {
      return NextResponse.json({ error: 'planType and billingPeriod are required' }, { status: 400 });
    }

    const plan = getPlanLimits(planType as PlanType);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_customer_id, plan_type')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ─── Stripe mode ───
    if (isStripeConfigured()) {
      const stripe = getStripeClient();
      if (!stripe) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
      }

      const priceId = billingPeriod === 'yearly' ? plan.stripeYearlyPriceId : plan.stripePriceId;
      if (!priceId) {
        return NextResponse.json({ error: 'Payment not configured for this plan' }, { status: 400 });
      }

      let customerId = user.stripe_customer_id as string | null;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id);
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';

      // Determine payment method types based on user selection
      // Stripe supports: card, wechat_pay, alipay
      let paymentMethodTypes: Array<'card' | 'wechat_pay' | 'alipay'> = ['card', 'wechat_pay', 'alipay'];
      if (paymentMethod === 'wechat_pay') {
        paymentMethodTypes = ['wechat_pay'];
      } else if (paymentMethod === 'alipay') {
        paymentMethodTypes = ['alipay'];
      } else if (paymentMethod === 'card') {
        paymentMethodTypes = ['card'];
      }

      const checkout = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: paymentMethodTypes,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/billing?success=true`,
        cancel_url: `${appUrl}/billing?canceled=true`,
        metadata: { userId: user.id, planType, billingPeriod },
      });

      return NextResponse.json({ url: checkout.url });
    }

    // ─── Demo mode (no Stripe key) ───
    // Directly upgrade the user's plan for testing purposes
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
      message: 'Demo mode: plan upgraded directly without payment',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
