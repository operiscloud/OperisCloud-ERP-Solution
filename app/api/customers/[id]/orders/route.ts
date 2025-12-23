import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';

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

    // Verify customer exists and belongs to tenant
    const customer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 });
    }

    // Fetch all orders for this customer
    const orders = await prisma.order.findMany({
      where: {
        customerId: id,
        tenantId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to include itemCount
    const ordersWithItemCount = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length,
    }));

    return NextResponse.json({ orders: ordersWithItemCount });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
