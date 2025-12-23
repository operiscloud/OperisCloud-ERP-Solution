import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { productSchema } from '@/lib/validations';
import { getPlan } from '@/lib/plans';

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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    const products = await prisma.product.findMany({
      where: {
        tenantId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(categoryId && { categoryId }),
        ...(type && { type: type as any }),
        ...(isActive !== null && { isActive: isActive === 'true' }),
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
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

    // Check plan limits
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const plan = getPlan(tenant.plan);

    // Check if product limit is reached (0 means unlimited)
    if (plan.limits.maxProducts > 0) {
      const currentProducts = await prisma.product.count({
        where: { tenantId },
      });

      if (currentProducts >= plan.limits.maxProducts) {
        return NextResponse.json(
          {
            error: `Limite de produits atteinte (${plan.limits.maxProducts} produits maximum pour le plan ${plan.name}). Passez à un plan supérieur pour ajouter plus de produits.`
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { variants, ...productData } = body;
    const validatedData = productSchema.parse(productData);

    // Create product with or without variants
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        tenantId,
        variants: variants && variants.length > 0 ? {
          create: variants.map((variant: any) => ({
            ...variant,
            productId: undefined, // Will be set by Prisma
          })),
        } : undefined,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
