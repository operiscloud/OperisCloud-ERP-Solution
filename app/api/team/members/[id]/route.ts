import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, role: true },
    });

    if (!currentUser || currentUser.role !== 'OWNER') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    const { role } = await request.json();

    // Validate role
    const validRoles = ['ADMIN', 'MANAGER', 'SELLER', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    // Check if target user is in same tenant
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser || targetUser.tenantId !== currentUser.tenantId) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Cannot change role of OWNER
    if (targetUser.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Impossible de modifier le rôle du propriétaire' },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rôle' },
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

    const { id } = await params;

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, role: true },
    });

    if (!currentUser || currentUser.role !== 'OWNER') {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    // Check if target user is in same tenant
    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser || targetUser.tenantId !== currentUser.tenantId) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Cannot delete OWNER
    if (targetUser.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Impossible de supprimer le propriétaire' },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    );
  }
}
