import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus } from 'lucide-react';
import OrdersList from '@/components/sales/OrdersList';

export default async function SalesPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true } } },
  });

  if (!user) redirect('/onboarding');

  const orders = await prisma.order.findMany({
    where: { tenantId: user.tenantId },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Decimal to number for client components
  const ordersForClient = orders.map(order => ({
    ...order,
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    taxRate: Number(order.taxRate),
    discount: Number(order.discount),
    total: Number(order.total),
    giftCardAmount: order.giftCardAmount ? Number(order.giftCardAmount) : null,
    shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
    customer: order.customer ? {
      ...order.customer,
      totalSpent: order.customer.totalSpent ? Number(order.customer.totalSpent) : 0,
    } : null,
    items: order.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
      totalPrice: item.totalPrice ? Number(item.totalPrice) : Number(item.total),
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price),
        costPrice: item.product.costPrice ? Number(item.product.costPrice) : null,
      } : null,
    })),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
          <p className="text-gray-600">Gérez vos commandes et devis</p>
        </div>
        <Link
          href="/sales/new"
          className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle commande
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <OrdersList orders={ordersForClient} currency={user.tenant.currency} />
      </div>
    </div>
  );
}
