// src/lib/stripe.ts

import Stripe from 'stripe';

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY || '';
  return key.startsWith('sk_test_') || key.startsWith('sk_live_');
}

export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-04-22.dahlia',
  });
}
