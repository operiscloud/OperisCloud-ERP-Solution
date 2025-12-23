import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getPlan } from '@/lib/plans';
import { recalculateAllSegments } from '@/lib/segments';

// GET /api/segments - List all segments
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has access to segmentation (BUSINESS plan only)
    const plan = getPlan(user.tenant.plan);
    if (!plan.features.hasCustomerSegmentation) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité nécessite le plan BUSINESS' },
        { status: 403 }
      );
    }

    const segments = await prisma.segment.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ segments });
  } catch (error) {
    console.error('Error fetching segments:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des segments' },
      { status: 500 }
    );
  }
}

// POST /api/segments - Create a new segment
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has access to segmentation (BUSINESS plan only)
    const plan = getPlan(user.tenant.plan);
    if (!plan.features.hasCustomerSegmentation) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité nécessite le plan BUSINESS' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, color, criteria } = body;

    if (!name || !criteria) {
      return NextResponse.json(
        { error: 'Le nom et les critères sont requis' },
        { status: 400 }
      );
    }

    // Count customers matching criteria
    const customerCount = await countCustomersMatchingCriteria(user.tenantId, criteria);

    const segment = await prisma.segment.create({
      data: {
        name,
        description: description || null,
        color: color || '#3b82f6',
        criteria,
        customerCount,
        tenantId: user.tenantId,
      },
    });

    // Recalculate all segments to assign customers to the new segment
    await recalculateAllSegments(user.tenantId);

    // Get updated segment with correct customer count
    const updatedSegment = await prisma.segment.findUnique({
      where: { id: segment.id },
    });

    return NextResponse.json({ segment: updatedSegment || segment }, { status: 201 });
  } catch (error) {
    console.error('Error creating segment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du segment' },
      { status: 500 }
    );
  }
}

// Helper function to count customers matching criteria
async function countCustomersMatchingCriteria(tenantId: string, criteria: any): Promise<number> {
  const where: any = { tenantId };

  // Apply criteria filters
  if (criteria.totalSpent) {
    if (criteria.totalSpent.min !== undefined) {
      where.totalSpent = { ...where.totalSpent, gte: criteria.totalSpent.min };
    }
    if (criteria.totalSpent.max !== undefined) {
      where.totalSpent = { ...where.totalSpent, lte: criteria.totalSpent.max };
    }
  }

  if (criteria.orderCount) {
    if (criteria.orderCount.min !== undefined) {
      where.totalOrders = { ...where.totalOrders, gte: criteria.orderCount.min };
    }
    if (criteria.orderCount.max !== undefined) {
      where.totalOrders = { ...where.totalOrders, lte: criteria.orderCount.max };
    }
  }

  if (criteria.tags && criteria.tags.length > 0) {
    where.tags = { hasSome: criteria.tags };
  }

  if (criteria.city && criteria.city.length > 0) {
    where.city = { in: criteria.city };
  }

  const count = await prisma.customer.count({ where });
  return count;
}
