import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { PlanType, UsageStats } from '@/lib/types/plans';

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

    // Get tenant plan
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    // Calculate current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage stats in parallel
    const [productsCount, ordersThisMonth, customersCount, usersCount] = await Promise.all([
      // Total active products
      prisma.product.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),

      // Orders this month (excluding cancelled)
      prisma.order.count({
        where: {
          tenantId,
          createdAt: { gte: monthStart },
          status: { not: 'CANCELLED' },
        },
      }),

      // Total customers
      prisma.customer.count({
        where: { tenantId },
      }),

      // Total users
      prisma.user.count({
        where: { tenantId },
      }),
    ]);

    const usage: UsageStats = {
      productsCount,
      ordersThisMonth,
      customersCount,
      usersCount,
    };

    return NextResponse.json({
      plan: tenant.plan as PlanType,
      usage,
    });
  } catch (error) {
    console.error('Error fetching plan usage:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
