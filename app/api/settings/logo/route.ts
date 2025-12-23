import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { validateImageDataUrl } from '@/lib/security';
import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { hasPermission } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = rateLimit(`logo_upload:${userId}`, RATE_LIMIT_CONFIGS.upload);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check permission
    if (!hasPermission(user.role, 'manageCompanySettings')) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas la permission de modifier le logo' },
        { status: 403 }
      );
    }

    const { logo } = await request.json();

    if (!logo || typeof logo !== 'string') {
      return NextResponse.json({ error: 'Logo invalide' }, { status: 400 });
    }

    // Strict validation
    const validation = validateImageDataUrl(logo);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Update tenant logo
    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: { logo },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du logo' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Remove tenant logo
    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: { logo: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du logo' },
      { status: 500 }
    );
  }
}
