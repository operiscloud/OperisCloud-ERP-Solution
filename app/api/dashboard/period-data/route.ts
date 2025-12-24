import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPeriodDates, getMonthsForPeriod } from '@/lib/dashboard/period-helper';
import { PeriodOption } from '@/components/dashboard/PeriodSelector';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tenantId: true,
        tenant: {
          select: {
            currency: true,
            plan: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '30days') as PeriodOption;

    // Check plan restrictions
    const hasProAccess = user.tenant.plan !== 'FREE';
    const restrictedPeriods: PeriodOption[] = ['3months', '6months', '12months', 'all'];

    if (restrictedPeriods.includes(period) && !hasProAccess) {
      return NextResponse.json(
        { error: 'Cette période nécessite un plan PRO ou BUSINESS' },
        { status: 403 }
      );
    }

    const tenantId = user.tenantId;
    const { start, end } = getPeriodDates(period);
    const monthsCount = getMonthsForPeriod(period);

    // Revenue data
    const revenueData = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthOrders = await prisma.order.aggregate({
        where: {
          tenantId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { total: true },
      });

      const monthGiftCards = await prisma.giftCard.findMany({
        where: {
          tenantId,
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        select: { initialAmount: true },
      });

      const giftCardsRevenue = monthGiftCards.reduce((sum, gc) => sum + Number(gc.initialAmount), 0);
      const totalRevenue = Number(monthOrders._sum.total || 0) + giftCardsRevenue;

      revenueData.push({
        month: monthStart.toLocaleDateString('fr-FR', { month: 'short' }),
        revenue: totalRevenue,
      });
    }

    // Top products for the selected period
    const topProducts = await prisma.orderItem.groupBy({
      by: ['name'],
      where: {
        order: {
          tenantId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: start, lte: end },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topProductsData = topProducts.map((item) => ({
      name: item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name,
      fullName: item.name,
      quantity: Number(item._sum.quantity || 0),
    }));

    // Profit margin data (PRO/BUSINESS only)
    let profitMarginData: Array<{ month: string; revenue: number; cost: number; profit: number; margin: number }> = [];

    if (hasProAccess) {
      for (let i = monthsCount - 1; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

        const monthRevenue = await prisma.order.aggregate({
          where: {
            tenantId,
            status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            createdAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { total: true, subtotal: true },
        });

        const monthExpenses = await prisma.expense.aggregate({
          where: {
            tenantId,
            date: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }).catch(() => ({ _sum: { amount: 0 } }));

        const revenue = Number(monthRevenue._sum.total || 0);
        const cost = Number(monthExpenses._sum.amount || 0);
        const profit = revenue - cost;
        const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

        profitMarginData.push({
          month: monthStart.toLocaleDateString('fr-FR', { month: 'short' }),
          revenue,
          cost,
          profit,
          margin,
        });
      }
    }

    // Category sales data for selected period (PRO/BUSINESS only)
    let categorySalesData: Array<{ name: string; value: number; percentage: number }> = [];

    if (hasProAccess) {
      const categorySales = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            tenantId,
            status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
            createdAt: { gte: start, lte: end },
          },
        },
        _sum: { totalPrice: true },
      });

      const productIds = categorySales.map(cs => cs.productId).filter(Boolean);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds as string[] } },
        select: {
          id: true,
          category: {
            select: {
              name: true
            }
          }
        },
      });

      const categoryMap = new Map<string, number>();
      categorySales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const category = product?.category?.name || 'Sans catégorie';
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + Number(sale._sum.totalPrice || 0));
      });

      const totalCategorySales = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

      categorySalesData = Array.from(categoryMap.entries())
        .map(([name, value]) => ({
          name,
          value,
          percentage: totalCategorySales > 0 ? (value / totalCategorySales) * 100 : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);
    }

    return NextResponse.json({
      revenueData,
      topProductsData,
      profitMarginData,
      categorySalesData,
      period,
    });
  } catch (error) {
    console.error('Error fetching period data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch period data' },
      { status: 500 }
    );
  }
}
