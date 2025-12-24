import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { updateCustomerStats } from '@/lib/customerStats';

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

    const order = await prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
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

    // Check if order exists and belongs to tenant
    const existingOrder = await prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Check if order can be edited (only DRAFT and CANCELLED orders)
    if (
      existingOrder.status !== 'DRAFT' &&
      existingOrder.status !== 'CANCELLED'
    ) {
      return NextResponse.json(
        { error: 'Cette commande ne peut pas être modifiée car elle est déjà confirmée' },
        { status: 400 }
      );
    }

    const {
      customerId,
      guestName,
      guestEmail,
      guestPhone,
      status,
      type,
      paymentMethod,
      taxRate,
      discount,
      shippingCost,
      dueDate,
      notes,
      items,
    } = body;

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount + shippingCost - discount;

    // Verify stock for new items
    for (const item of items) {
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (variant && variant.product.trackStock) {
          // Calculate current stock plus what will be restored from old order
          const oldItem = existingOrder.items.find(
            (oldItem) => oldItem.variantId === item.variantId
          );
          const availableStock = variant.stockQuantity + (oldItem?.quantity || 0);

          if (availableStock < item.quantity) {
            return NextResponse.json(
              {
                error: `Stock insuffisant pour ${item.name}. Disponible: ${availableStock}`,
              },
              { status: 400 }
            );
          }
        }
      } else if (item.productId) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (product && product.trackStock) {
          // Calculate current stock plus what will be restored from old order
          const oldItem = existingOrder.items.find(
            (oldItem) => oldItem.productId === item.productId
          );
          const availableStock = product.stockQuantity + (oldItem?.quantity || 0);

          if (availableStock < item.quantity) {
            return NextResponse.json(
              {
                error: `Stock insuffisant pour ${item.name}. Disponible: ${availableStock}`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // Update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stock from old items
      for (const oldItem of existingOrder.items) {
        if (oldItem.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: oldItem.variantId },
            include: { product: true },
          });

          if (variant && variant.product.trackStock) {
            await tx.productVariant.update({
              where: { id: oldItem.variantId },
              data: {
                stockQuantity: {
                  increment: oldItem.quantity,
                },
              },
            });
          }
        } else if (oldItem.productId) {
          const product = await tx.product.findUnique({
            where: { id: oldItem.productId },
          });

          if (product && product.trackStock) {
            await tx.product.update({
              where: { id: oldItem.productId },
              data: {
                stockQuantity: {
                  increment: oldItem.quantity,
                },
              },
            });
          }
        }
      }

      // Deduct stock for new items
      for (const newItem of items) {
        if (newItem.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: newItem.variantId },
            include: { product: true },
          });

          if (variant && variant.product.trackStock) {
            await tx.productVariant.update({
              where: { id: newItem.variantId },
              data: {
                stockQuantity: {
                  decrement: newItem.quantity,
                },
              },
            });
          }
        } else if (newItem.productId) {
          const product = await tx.product.findUnique({
            where: { id: newItem.productId },
          });

          if (product && product.trackStock) {
            await tx.product.update({
              where: { id: newItem.productId },
              data: {
                stockQuantity: {
                  decrement: newItem.quantity,
                },
              },
            });
          }
        }
      }

      // Delete existing order items
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Update order
      const order = await tx.order.update({
        where: { id },
        data: {
          customerId: customerId || null,
          guestName: guestName || null,
          guestEmail: guestEmail || null,
          guestPhone: guestPhone || null,
          status,
          type,
          paymentMethod: paymentMethod || null,
          taxRate,
          taxAmount,
          discount,
          shippingCost,
          dueDate: dueDate ? new Date(dueDate) : null,
          notes: notes || null,
          subtotal,
          total,
          // Create new order items
          items: {
            create: items.map((item: any) => ({
              productId: item.productId || null,
              variantId: item.variantId || null,
              name: item.name,
              sku: item.sku || null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      return order;
    });

    // Update customer statistics if this is not a guest order
    if (updatedOrder.customerId) {
      await updateCustomerStats(updatedOrder.customerId, tenantId);
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la commande' },
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

    // Check if order exists and belongs to tenant
    const existingOrder = await prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Delete order and restore stock in a transaction
    await prisma.$transaction(async (tx) => {
      // Restore stock for each item
      for (const item of existingOrder.items) {
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
                  increment: item.quantity,
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
                  increment: item.quantity,
                },
              },
            });
          }
        }
      }

      // Delete order (cascade will delete order items)
      await tx.order.delete({
        where: { id },
      });
    });

    // Update customer statistics if this was not a guest order
    if (existingOrder.customerId) {
      await updateCustomerStats(existingOrder.customerId, tenantId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la commande' },
      { status: 500 }
    );
  }
}
