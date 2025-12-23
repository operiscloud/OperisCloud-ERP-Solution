import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';

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

    const giftCard = await prisma.giftCard.findFirst({
      where: { id, tenantId },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            giftCardAmount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!giftCard) {
      return NextResponse.json({ error: 'Bon cadeau non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ giftCard });
  } catch (error) {
    console.error('Error fetching gift card:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du bon cadeau' },
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

    // Check if gift card exists
    const existingCard = await prisma.giftCard.findFirst({
      where: { id, tenantId },
    });

    if (!existingCard) {
      return NextResponse.json({ error: 'Bon cadeau non trouvé' }, { status: 404 });
    }

    // Update gift card
    const giftCard = await prisma.giftCard.update({
      where: { id },
      data: {
        isActive: body.isActive !== undefined ? body.isActive : existingCard.isActive,
      },
    });

    return NextResponse.json({ giftCard });
  } catch (error: any) {
    console.error('Error updating gift card:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification du bon cadeau' },
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

    // Check if gift card exists
    const existingCard = await prisma.giftCard.findFirst({
      where: { id, tenantId },
      include: {
        orders: true,
      },
    });

    if (!existingCard) {
      return NextResponse.json({ error: 'Bon cadeau non trouvé' }, { status: 404 });
    }

    // Check if gift card has been used
    if (existingCard.orders.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un bon cadeau qui a été utilisé' },
        { status: 400 }
      );
    }

    // Delete gift card
    await prisma.giftCard.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gift card:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du bon cadeau' },
      { status: 500 }
    );
  }
}
