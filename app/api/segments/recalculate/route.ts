import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { recalculateAllSegments } from '@/lib/segments';
import { getPlan } from '@/lib/plans';

// POST /api/segments/recalculate - Recalculate all segments and reassign customers
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

    // Recalculate all segments
    await recalculateAllSegments(user.tenantId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recalculating segments:', error);
    return NextResponse.json(
      { error: 'Erreur lors du recalcul des segments' },
      { status: 500 }
    );
  }
}
