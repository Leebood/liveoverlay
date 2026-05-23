// src/app/api/billing/portal/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { isStripeConfigured, getStripeClient } from '@/lib/stripe';

// POST /api/billing/portal
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Demo mode: no Stripe configured
    if (!isStripeConfigured()) {
      return NextResponse.json({
        url: '/billing?demo=true',
        demo: true,
        message: 'Demo mode: manage your plan directly from the billing page',
      });
    }

    const supabase = getSupabaseClient();
    const { data: user } = await supabase
      .from('users')
      .select('id, stripe_customer_id')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const appUrl = process.env.COZE_PROJECT_DOMAIN_DEFAULT || 'http://localhost:5000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id as string,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
