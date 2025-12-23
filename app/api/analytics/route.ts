import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';

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

    // Get user's currency
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenant: { select: { currency: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const currency = user.tenant.currency;

    // Get filter parameters
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || '30days';
    const customStartDate = searchParams.get('startDate');
    const customEndDate = searchParams.get('endDate');

    // Calculate date ranges
    const now = new Date();
    let currentStartDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (filter) {
      case '7days':
        currentStartDate = new Date(now);
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case '30days':
        currentStartDate = new Date(now);
        currentStartDate.setDate(currentStartDate.getDate() - 30);
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case '3months':
        currentStartDate = new Date(now);
        currentStartDate.setMonth(currentStartDate.getMonth() - 3);
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setMonth(previousStartDate.getMonth() - 3);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case '1year':
        currentStartDate = new Date(now);
        currentStartDate.setFullYear(currentStartDate.getFullYear() - 1);
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      case 'all':
        // Get all data from the beginning
        currentStartDate = new Date(0); // Beginning of time
        previousStartDate = new Date(0);
        previousEndDate = new Date(0);
        break;

      case 'custom':
        if (!customStartDate || !customEndDate) {
          return NextResponse.json({ error: 'Dates personnalisées requises' }, { status: 400 });
        }
        currentStartDate = new Date(customStartDate);
        const currentEnd = new Date(customEndDate);
        const rangeDays = Math.ceil(
          (currentEnd.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(previousStartDate.getDate() - rangeDays);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
        break;

      default:
        currentStartDate = new Date(now);
        currentStartDate.setDate(currentStartDate.getDate() - 30);
        previousStartDate = new Date(currentStartDate);
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        previousEndDate = new Date(currentStartDate);
        previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
    }

    // Fetch current period data
    const [
      currentOrders,
      previousOrders,
      totalCustomers,
      totalProducts,
      currentExpenses,
      lowStockProducts,
      currentGiftCards,
      previousGiftCards,
    ] = await Promise.all([
      // Current period orders
      prisma.order.findMany({
        where: {
          tenantId,
          createdAt: { gte: currentStartDate },
          status: { not: 'CANCELLED' },
        },
        select: {
          total: true,
          status: true,
          createdAt: true,
          giftCardAmount: true,
        },
      }),
      // Previous period orders (for comparison)
      filter !== 'all'
        ? prisma.order.findMany({
            where: {
              tenantId,
              createdAt: {
                gte: previousStartDate,
                lte: previousEndDate,
              },
              status: { not: 'CANCELLED' },
            },
            select: {
              total: true,
            },
          })
        : Promise.resolve([]),
      // Total customers
      prisma.customer.count({
        where: { tenantId },
      }),
      // Total products
      prisma.product.count({
        where: { tenantId, isActive: true },
      }),
      // Current period expenses
      prisma.expense.findMany({
        where: {
          tenantId,
          date: { gte: currentStartDate },
        },
        select: {
          amount: true,
        },
      }),
      // Low stock products
      prisma.product.findMany({
        where: {
          tenantId,
          trackStock: true,
          isActive: true,
          AND: [
            { lowStockAlert: { not: null } },
            {
              OR: [{ stockQuantity: { lte: prisma.product.fields.lowStockAlert } }],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          stockQuantity: true,
          lowStockAlert: true,
        },
        take: 5,
      }),
      // Current period gift cards
      prisma.giftCard.findMany({
        where: {
          tenantId,
          createdAt: { gte: currentStartDate },
        },
        select: {
          initialAmount: true,
        },
      }),
      // Previous period gift cards
      filter !== 'all'
        ? prisma.giftCard.findMany({
            where: {
              tenantId,
              createdAt: {
                gte: previousStartDate,
                lte: previousEndDate,
              },
            },
            select: {
              initialAmount: true,
            },
          })
        : Promise.resolve([]),
    ]);

    // Calculate gift card sales
    const totalGiftCardsSold = currentGiftCards.reduce(
      (sum, card) => sum + Number(card.initialAmount),
      0
    );
    const totalGiftCardsSoldPrevious = previousGiftCards.reduce(
      (sum, card) => sum + Number(card.initialAmount),
      0
    );

    // Calculate metrics
    const currentOrdersRevenue = currentOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const currentRevenue = currentOrdersRevenue + totalGiftCardsSold;

    const previousOrdersRevenue = previousOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const previousRevenue = previousOrdersRevenue + totalGiftCardsSoldPrevious;

    const currentOrderCount = currentOrders.length;
    const previousOrderCount = previousOrders.length;

    const currentExpensesTotal = currentExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const profit = currentRevenue - currentExpensesTotal;
    const profitMargin = currentRevenue > 0 ? (profit / currentRevenue) * 100 : 0;

    // Calculate gift card usage
    const totalGiftCardUsed = currentOrders.reduce(
      (sum, order) => sum + Number(order.giftCardAmount || 0),
      0
    );

    // Order status breakdown
    const confirmedOrders = currentOrders.filter((o) => o.status === 'CONFIRMED').length;
    const draftOrders = currentOrders.filter((o) => o.status === 'DRAFT').length;

    // Average order value
    const averageOrderValue = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;

    // Daily revenue
    const dailyRevenue: { [key: string]: number } = {};
    currentOrders.forEach((order) => {
      const dateKey = new Date(order.createdAt).toISOString().split('T')[0];
      dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + Number(order.total);
    });

    return NextResponse.json({
      currentRevenue,
      previousRevenue,
      currentOrderCount,
      previousOrderCount,
      confirmedOrders,
      draftOrders,
      totalCustomers,
      totalProducts,
      currentExpenses: currentExpensesTotal,
      profit,
      profitMargin,
      averageOrderValue,
      totalGiftCardsSold,
      totalGiftCardUsed,
      lowStockProducts,
      dailyRevenue,
      currency,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
