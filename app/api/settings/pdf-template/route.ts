import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tenantId: true,
        tenant: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check if user has PRO or BUSINESS plan
    const hasAccess = user.tenant.plan === 'PRO' || user.tenant.plan === 'BUSINESS';

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Cette fonctionnalité est réservée aux plans PRO et BUSINESS' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { config } = body;

    // Validate config
    if (!config || typeof config !== 'object') {
      return NextResponse.json({ error: 'Configuration invalide' }, { status: 400 });
    }

    // Update tenant with PDF template config
    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        pdfTemplateConfig: config,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving PDF template config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la configuration' },
      { status: 500 }
    );
  }
}
