import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductEditForm from '@/components/inventory/ProductEditForm';

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
      tenantId: user.tenantId,
    },
    include: {
      category: true,
      variants: {
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch orders containing this product
  const orderItems = await prisma.orderItem.findMany({
    where: {
      OR: [
        { productId: params.id },
        {
          variant: {
            productId: params.id,
          },
        },
      ],
      order: {
        tenantId: user.tenantId,
      },
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      variant: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      order: {
        createdAt: 'desc',
      },
    },
  });

  // Group by order and calculate total quantity
  const ordersMap = new Map();
  orderItems.forEach((item) => {
    const orderId = item.order.id;
    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        ...item.order,
        totalQuantity: 0,
        items: [],
      });
    }
    const orderData = ordersMap.get(orderId);
    orderData.totalQuantity += item.quantity;
    orderData.items.push({
      quantity: item.quantity,
      variantName: item.variant?.name || null,
    });
  });

  const orders = Array.from(ordersMap.values());

  // Convert Decimal fields to numbers for client component
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      costPrice: v.costPrice ? Number(v.costPrice) : null,
    })),
  };

  // Serialize orders data
  const serializedOrders = orders.map((order) => ({
    ...order,
    total: Number(order.total),
  }));

  return <ProductEditForm product={serializedProduct} orders={serializedOrders} />;
}
