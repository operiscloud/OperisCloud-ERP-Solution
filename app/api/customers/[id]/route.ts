import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { customerSchema } from '@/lib/validations';
import { assignCustomerToSegment } from '@/lib/segments';
import { getPlan } from '@/lib/plans';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const { id } = await params;

    const customer = await prisma.customer.findFirst({
      where: { id, tenantId },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = customerSchema.partial().parse(body);

    // Check if tags are being used and if plan allows it
    if (validatedData.tags && validatedData.tags.length > 0) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true },
      });

      if (!tenant) {
        return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
      }

      const plan = getPlan(tenant.plan);

      if (!plan.features.hasCustomerSegmentation) {
        return NextResponse.json(
          {
            error: `Les tags clients sont disponibles à partir du plan Business. Passez à un plan supérieur pour utiliser cette fonctionnalité.`
          },
          { status: 403 }
        );
      }
    }

    const result = await prisma.customer.updateMany({
      where: { id, tenantId },
      data: validatedData,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    const customer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    // Auto-reassign to matching segment after update
    await assignCustomerToSegment(id, tenantId);

    return NextResponse.json({ customer });
  } catch (error: any) {
    console.error('Error updating customer:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification du client' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const { id } = await params;

    const result = await prisma.customer.deleteMany({
      where: { id, tenantId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    );
  }
}
