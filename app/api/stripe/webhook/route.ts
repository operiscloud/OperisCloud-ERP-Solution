import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = session.metadata?.tenantId;
  const plan = session.metadata?.plan;

  if (!tenantId || !plan) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      plan: plan as 'PRO' | 'BUSINESS',
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`✅ Checkout completed for tenant ${tenantId}, plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const tenant = await prisma.tenant.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!tenant) {
    console.error(`Tenant not found for subscription ${subscription.id}`);
    return;
  }

  // Determine plan based on price ID (supports both monthly and yearly)
  const priceId = subscription.items.data[0].price.id;
  let newPlan: 'FREE' | 'PRO' | 'BUSINESS' = tenant.plan;

  // Check for PRO plan (monthly or yearly)
  if (
    priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PRO_YEARLY
  ) {
    newPlan = 'PRO';
  }
  // Check for BUSINESS plan (monthly or yearly)
  else if (
    priceId === process.env.STRIPE_PRICE_BUSINESS_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_BUSINESS_YEARLY
  ) {
    newPlan = 'BUSINESS';
  }

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      plan: newPlan,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`✅ Subscription updated for tenant ${tenant.id}, new plan: ${newPlan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const tenant = await prisma.tenant.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!tenant) {
    console.error(`Tenant not found for subscription ${subscription.id}`);
    return;
  }

  // Downgrade to FREE plan
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      plan: 'FREE',
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    },
  });

  console.log(`✅ Subscription cancelled for tenant ${tenant.id}, downgraded to FREE`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const tenant = await prisma.tenant.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!tenant) {
    console.error(`Tenant not found for subscription ${subscription.id}`);
    return;
  }

  // Update the current period end
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: {
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log(`✅ Invoice paid for tenant ${tenant.id}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const tenant = await prisma.tenant.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!tenant) {
    console.error(`Tenant not found for subscription ${subscription.id}`);
    return;
  }

  // TODO: Send email notification about failed payment
  console.log(`❌ Invoice payment failed for tenant ${tenant.id}`);
}
