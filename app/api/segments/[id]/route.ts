import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getPlan } from '@/lib/plans';
import { recalculateAllSegments } from '@/lib/segments';

// GET /api/segments/[id] - Get a single segment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has access to segmentation
    const plan = getPlan(user.tenant.plan);
    if (!plan.features.hasCustomerSegmentation) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité nécessite le plan BUSINESS' },
        { status: 403 }
      );
    }

    // Get segment
    const segment = await prisma.segment.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!segment) {
      return NextResponse.json({ error: 'Segment non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ segment });
  } catch (error) {
    console.error('Error fetching segment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du segment' },
      { status: 500 }
    );
  }
}

// PATCH /api/segments/[id] - Update a segment
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has access to segmentation
    const plan = getPlan(user.tenant.plan);
    if (!plan.features.hasCustomerSegmentation) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité nécessite le plan BUSINESS' },
        { status: 403 }
      );
    }

    // Verify segment belongs to user's tenant
    const existingSegment = await prisma.segment.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existingSegment) {
      return NextResponse.json({ error: 'Segment non trouvé' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, color, criteria } = body;

    if (!name || !criteria) {
      return NextResponse.json(
        { error: 'Le nom et les critères sont requis' },
        { status: 400 }
      );
    }

    // Update segment
    const segment = await prisma.segment.update({
      where: { id },
      data: {
        name,
        description: description || null,
        color: color || '#3b82f6',
        criteria,
      },
    });

    // Recalculate all segments to reassign customers based on new criteria
    await recalculateAllSegments(user.tenantId);

    // Get updated segment with correct customer count
    const updatedSegment = await prisma.segment.findUnique({
      where: { id: segment.id },
    });

    return NextResponse.json({ segment: updatedSegment || segment });
  } catch (error) {
    console.error('Error updating segment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du segment' },
      { status: 500 }
    );
  }
}

// DELETE /api/segments/[id] - Delete a segment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has access to segmentation
    const plan = getPlan(user.tenant.plan);
    if (!plan.features.hasCustomerSegmentation) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité nécessite le plan BUSINESS' },
        { status: 403 }
      );
    }

    // Verify segment belongs to user's tenant
    const segment = await prisma.segment.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!segment) {
      return NextResponse.json({ error: 'Segment non trouvé' }, { status: 404 });
    }

    // Remove segment reference from customers
    await prisma.customer.updateMany({
      where: { segmentId: id },
      data: { segmentId: null },
    });

    // Delete segment
    await prisma.segment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting segment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du segment' },
      { status: 500 }
    );
  }
}
