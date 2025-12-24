import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Stripe Price IDs - You'll need to create these in your Stripe Dashboard
// https://dashboard.stripe.com/test/products
export const STRIPE_PLANS = {
  PRO: {
    name: 'PRO',
    priceId: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    },
    price: {
      monthly: 29, // CHF per month
      yearly: 290, // CHF per year (~2 months free)
    },
  },
  BUSINESS: {
    name: 'BUSINESS',
    priceId: {
      monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
      yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_yearly',
    },
    price: {
      monthly: 69, // CHF per month
      yearly: 690, // CHF per year (~2 months free)
    },
  },
} as const;

export type StripePlanName = keyof typeof STRIPE_PLANS;
export type BillingCycle = 'monthly' | 'yearly';
