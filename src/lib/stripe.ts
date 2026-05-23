// src/lib/stripe.ts

import Stripe from 'stripe';

export function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-04-22.dahlia',
  });
}
