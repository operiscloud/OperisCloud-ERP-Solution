import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';

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

    const giftCards = await prisma.giftCard.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ giftCards });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bons cadeaux' },
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

    const body = await request.json();
    const { code, amount, expiresAt } = body;

    // Validate required fields
    if (!code || !amount) {
      return NextResponse.json(
        { error: 'Le code et le montant sont requis' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCard = await prisma.giftCard.findFirst({
      where: {
        code: code.toUpperCase(),
        tenantId,
      },
    });

    if (existingCard) {
      return NextResponse.json(
        { error: 'Ce code existe déjà' },
        { status: 400 }
      );
    }

    // Create gift card
    const giftCard = await prisma.giftCard.create({
      data: {
        code: code.toUpperCase(),
        initialAmount: amount,
        balance: amount,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        tenantId,
      },
    });

    return NextResponse.json({ giftCard }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating gift card:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du bon cadeau' },
      { status: 500 }
    );
  }
}
