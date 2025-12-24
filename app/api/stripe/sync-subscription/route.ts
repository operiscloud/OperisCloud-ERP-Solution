import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe/config';

// Temporary endpoint to manually sync subscription data
// This is useful for development when webhooks can't reach localhost
export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Find tenant by customer ID
    const tenant = await prisma.tenant.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Determine plan based on price ID (supports both monthly and yearly)
    const priceId = subscription.items.data[0].price.id;
    let plan: 'PRO' | 'BUSINESS' = 'PRO';

    // Check for BUSINESS plan (monthly or yearly)
    if (
      priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY ||
      priceId === process.env.STRIPE_PRICE_BUSINESS_YEARLY
    ) {
      plan = 'BUSINESS';
    }
    // Check for PRO plan (monthly or yearly)
    else if (
      priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
      priceId === process.env.STRIPE_PRICE_PRO_YEARLY
    ) {
      plan = 'PRO';
    }

    // Update tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        plan,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        plan: updatedTenant.plan,
        stripeCustomerId: updatedTenant.stripeCustomerId,
        stripeSubscriptionId: updatedTenant.stripeSubscriptionId,
        stripeCurrentPeriodEnd: updatedTenant.stripeCurrentPeriodEnd,
      },
    });
  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json(
      { error: 'Error syncing subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
