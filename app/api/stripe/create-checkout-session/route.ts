import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, STRIPE_PLANS } from '@/lib/stripe/config';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { plan, billingCycle = 'monthly' } = await request.json();

    if (!plan || (plan !== 'PRO' && plan !== 'BUSINESS')) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    if (billingCycle !== 'monthly' && billingCycle !== 'yearly') {
      return NextResponse.json({ error: 'Cycle de facturation invalide' }, { status: 400 });
    }

    // Get user and tenant
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { tenant: true },
    });

    if (!user || !user.tenant) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];
    const priceId = billingCycle === 'yearly' ? planConfig.priceId.yearly : planConfig.priceId.monthly;

    // Check if customer already exists
    let customerId = user.tenant.stripeCustomerId;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.tenant.name,
        metadata: {
          tenantId: user.tenant.id,
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Update tenant with Stripe customer ID
      await prisma.tenant.update({
        where: { id: user.tenant.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true&plan=${plan}&billingCycle=${billingCycle}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        tenantId: user.tenant.id,
        plan,
        billingCycle,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
