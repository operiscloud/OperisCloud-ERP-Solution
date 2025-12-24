import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products/barcode?code=123456789
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Get user and tenant
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { tenant: true },
    });

    if (!user || !user.tenant) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const barcode = searchParams.get('code');

    if (!barcode) {
      return NextResponse.json({ error: 'Code-barres requis' }, { status: 400 });
    }

    // Search for product by barcode
    const product = await prisma.product.findFirst({
      where: {
        tenantId: user.tenant.id,
        barcode: barcode,
        isActive: true,
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (product) {
      return NextResponse.json({
        found: true,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price.toString(),
          costPrice: product.costPrice?.toString(),
          stockQuantity: product.stockQuantity,
          trackStock: product.trackStock,
          hasVariants: product.hasVariants,
          variants: product.variants,
          category: product.category,
          images: product.images,
        },
      });
    }

    // Check if variant has this barcode
    const variant = await prisma.productVariant.findFirst({
      where: {
        barcode: barcode,
        isActive: true,
        product: {
          tenantId: user.tenant.id,
          isActive: true,
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (variant) {
      return NextResponse.json({
        found: true,
        isVariant: true,
        product: {
          id: variant.product.id,
          name: variant.product.name,
          description: variant.product.description,
          sku: variant.product.sku,
          barcode: variant.product.barcode,
          price: variant.product.price.toString(),
          category: variant.product.category,
          images: variant.product.images,
        },
        variant: {
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price?.toString() || variant.product.price.toString(),
          stockQuantity: variant.stockQuantity,
          attributes: variant.attributes,
        },
      });
    }

    // Product not found
    return NextResponse.json({
      found: false,
      barcode: barcode,
    });
  } catch (error) {
    console.error('Error searching barcode:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche du code-barres' },
      { status: 500 }
    );
  }
}
