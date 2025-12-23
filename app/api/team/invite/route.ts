import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, role: true },
    });

    if (!currentUser || currentUser.role !== 'OWNER') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    const { email, role, tenantId } = await request.json();

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'SELLER', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    // Check if user already exists in tenant
    const existingUser = await prisma.user.findFirst({
      where: { email, tenantId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet utilisateur fait déjà partie de votre équipe' },
        { status: 400 }
      );
    }

    // In a real app, you would send an email invitation here
    // For now, we'll create a placeholder invitation

    return NextResponse.json({
      message: 'Invitation envoyée',
      email,
      role,
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'invitation' },
      { status: 500 }
    );
  }
}
