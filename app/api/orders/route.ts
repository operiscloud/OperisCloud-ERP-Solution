import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { orderSchema } from '@/lib/validations';
import { generateOrderNumber } from '@/lib/orderNumber';
import { updateCustomerStats } from '@/lib/customerStats';

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

    const orders = await prisma.order.findMany({
      where: { tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
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

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = (subtotal * validatedData.taxRate) / 100;
    let total = subtotal + taxAmount - validatedData.discount + validatedData.shippingCost;

    // Validate and calculate gift card discount
    let giftCard = null;
    let giftCardAmount = 0;

    if (validatedData.giftCardCode) {
      giftCard = await prisma.giftCard.findFirst({
        where: {
          code: validatedData.giftCardCode.toUpperCase(),
          tenantId,
          isActive: true,
        },
      });

      if (!giftCard) {
        return NextResponse.json(
          { error: 'Bon cadeau invalide ou inactif' },
          { status: 400 }
        );
      }

      if (giftCard.expiresAt && new Date(giftCard.expiresAt) <= new Date()) {
        return NextResponse.json(
          { error: 'Ce bon cadeau a expiré' },
          { status: 400 }
        );
      }

      if (Number(giftCard.balance) <= 0) {
        return NextResponse.json(
          { error: 'Ce bon cadeau n\'a plus de solde' },
          { status: 400 }
        );
      }

      // Calculate amount to deduct from gift card
      giftCardAmount = Math.min(Number(giftCard.balance), total);
      total = total - giftCardAmount;
    }

    // Vérifier le stock disponible et le décrémenter
    for (const item of validatedData.items) {
      if (item.variantId) {
        // Produit avec variante
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (variant && variant.product.trackStock) {
          if (variant.stockQuantity < item.quantity) {
            return NextResponse.json(
              { error: `Stock insuffisant pour ${item.name}. Disponible: ${variant.stockQuantity}` },
              { status: 400 }
            );
          }
        }
      } else if (item.productId) {
        // Produit sans variante
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product && product.trackStock) {
          if (product.stockQuantity < item.quantity) {
            return NextResponse.json(
              { error: `Stock insuffisant pour ${item.name}. Disponible: ${product.stockQuantity}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Créer la commande et décrémenter le stock dans une transaction
    const order = await prisma.$transaction(async (tx) => {
      // Décrémenter le stock
      for (const item of validatedData.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          });

          if (variant && variant.product.trackStock) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        } else if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product && product.trackStock) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      }

      // Update gift card balance if used
      if (giftCard && giftCardAmount > 0) {
        await tx.giftCard.update({
          where: { id: giftCard.id },
          data: {
            balance: {
              decrement: giftCardAmount,
            },
            usedAt: giftCard.usedAt || new Date(),
          },
        });
      }

      // Créer la commande
      return await tx.order.create({
        data: {
          orderNumber: await generateOrderNumber(tenantId),
          tenantId,
          customerId: validatedData.customerId,
          guestName: validatedData.guestName,
          guestEmail: validatedData.guestEmail,
          guestPhone: validatedData.guestPhone,
          type: validatedData.type,
          status: validatedData.status,
          channel: validatedData.channel,
          subtotal,
          taxRate: validatedData.taxRate,
          taxAmount,
          discount: validatedData.discount,
          shippingCost: validatedData.shippingCost,
          total,
          giftCardId: giftCard?.id,
          giftCardAmount,
          shippingAddress: validatedData.shippingAddress,
          notes: validatedData.notes,
          internalNotes: validatedData.internalNotes,
          paymentStatus: validatedData.paymentStatus,
          paymentMethod: validatedData.paymentMethod,
          createdAt: validatedData.orderDate ? new Date(validatedData.orderDate) : undefined,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          customer: true,
          items: { include: { product: true } },
        },
      });
    });

    // Update customer statistics if this is not a guest order
    if (order.customerId) {
      await updateCustomerStats(order.customerId, tenantId);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
