import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: { hasCompletedTutorial: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing tutorial:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
