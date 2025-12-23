import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlan, isWithinLimit } from '@/lib/plans';

// GET /api/categories - Get all categories for the tenant
export async function GET() {
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

    const categories = await prisma.category.findMany({
      where: { tenantId: user.tenantId },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des catégories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, tenant: { select: { plan: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check category limit
    const categoriesCount = await prisma.category.count({
      where: { tenantId: user.tenantId },
    });

    const plan = getPlan(user.tenant.plan);
    if (!isWithinLimit(user.tenant.plan, 'maxCategories', categoriesCount)) {
      const limit = plan.limits.maxCategories;
      return NextResponse.json(
        {
          error: `Limite de catégories atteinte (${limit} max pour le plan ${plan.name}). Passez à un plan supérieur pour créer plus de catégories.`
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    // Check if category name already exists for this tenant
    const existingCategory = await prisma.category.findFirst({
      where: {
        tenantId: user.tenantId,
        name: name.trim(),
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        tenantId: user.tenantId,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
