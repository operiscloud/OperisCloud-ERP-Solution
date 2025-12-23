import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { customerSchema } from '@/lib/validations';
import { assignCustomerToSegment } from '@/lib/segments';
import { getPlan } from '@/lib/plans';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const customers = await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    // Check plan limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const plan = getPlan(tenant.plan);

    // Check if customer limit is reached (0 means unlimited)
    if (plan.limits.maxCustomers > 0) {
      const currentCustomers = await prisma.customer.count({
        where: { tenantId },
      });

      if (currentCustomers >= plan.limits.maxCustomers) {
        return NextResponse.json(
          {
            error: `Limite de clients atteinte (${plan.limits.maxCustomers} clients maximum pour le plan ${plan.name}). Passez à un plan supérieur pour ajouter plus de clients.`
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const validatedData = customerSchema.parse(body);

    // Check if tags are being used and if plan allows it
    if (validatedData.tags && validatedData.tags.length > 0) {
      if (!plan.features.hasCustomerSegmentation) {
        return NextResponse.json(
          {
            error: `Les tags clients sont disponibles à partir du plan Business. Passez à un plan supérieur pour utiliser cette fonctionnalité.`
          },
          { status: 403 }
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        ...validatedData,
        tenantId,
      },
    });

    // Auto-assign to matching segment
    await assignCustomerToSegment(customer.id, tenantId);

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
}
