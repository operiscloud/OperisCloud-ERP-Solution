import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { expenseSchema } from '@/lib/validations';

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

    const expense = await prisma.expense.findFirst({
      where: { id, tenantId },
    });

    if (!expense) {
      return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la dépense' },
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
    const validatedData = expenseSchema.partial().parse(body);

    const result = await prisma.expense.updateMany({
      where: { id, tenantId },
      data: validatedData,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 });
    }

    const expense = await prisma.expense.findFirst({
      where: { id, tenantId },
    });

    return NextResponse.json({ expense });
  } catch (error: any) {
    console.error('Error updating expense:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la dépense' },
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

    const result = await prisma.expense.deleteMany({
      where: { id, tenantId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la dépense' },
      { status: 500 }
    );
  }
}
