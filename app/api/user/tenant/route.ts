import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Check if user exists in database with a tenant
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            subdomain: true,
          }
        }
      },
    });

    if (!user || !user.tenantId) {
      return NextResponse.json({ hasTenant: false });
    }

    return NextResponse.json({
      hasTenant: true,
      tenant: user.tenant,
    });
  } catch (error) {
    console.error('Error checking tenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
