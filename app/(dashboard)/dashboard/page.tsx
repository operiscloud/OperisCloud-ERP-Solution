import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, calculatePercentageChange } from '@/lib/utils';
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { filterWidgetsByPlan, mergeWithDefaults, DashboardWidgetConfig } from '@/lib/dashboard/widget-config-helper';
import TutorialWrapper from '@/components/tutorial/TutorialWrapper';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      tenantId: true,
      hasCompletedTutorial: true,
      tenant: {
        select: {
          currency: true,
          plan: true,
          dashboardWidgetConfig: true,
        }
      }
    },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const tenantId = user.tenantId;
  const hasProAccess = user.tenant.plan !== 'FREE';

  // Get current month stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Revenue this month
  const currentRevenue = await prisma.order.aggregate({
    where: {
      tenantId,
      status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      createdAt: { gte: startOfMonth },
    },
    _sum: { total: true },
  });

  const lastMonthRevenue = await prisma.order.aggregate({
    where: {
      tenantId,
      status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
    _sum: { total: true },
  });

  // Gift cards revenue
  const currentGiftCards = await prisma.giftCard.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfMonth },
    },
    select: { initialAmount: true },
  });

  const lastMonthGiftCards = await prisma.giftCard.findMany({
    where: {
      tenantId,
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
    select: { initialAmount: true },
  });

  const currentGiftCardsRevenue = currentGiftCards.reduce((sum, gc) => sum + Number(gc.initialAmount), 0);
  const lastMonthGiftCardsRevenue = lastMonthGiftCards.reduce((sum, gc) => sum + Number(gc.initialAmount), 0);

  const totalCurrentRevenue = Number(currentRevenue._sum.total || 0) + currentGiftCardsRevenue;
  const totalLastMonthRevenue = Number(lastMonthRevenue._sum.total || 0) + lastMonthGiftCardsRevenue;

  const revenueChange = calculatePercentageChange(
    totalCurrentRevenue,
    totalLastMonthRevenue
  );

  // Orders this month
  const currentOrders = await prisma.order.count({
    where: {
      tenantId,
      createdAt: { gte: startOfMonth },
      status: { not: 'DRAFT' },
    },
  });

  const lastMonthOrders = await prisma.order.count({
    where: {
      tenantId,
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      status: { not: 'DRAFT' },
    },
  });

  const ordersChange = calculatePercentageChange(currentOrders, lastMonthOrders);

  // Customers
  const totalCustomers = await prisma.customer.count({
    where: { tenantId },
  });

  const newCustomers = await prisma.customer.count({
    where: {
      tenantId,
      createdAt: { gte: startOfMonth },
    },
  });

  const lastMonthNewCustomers = await prisma.customer.count({
    where: {
      tenantId,
      createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
  });

  const customersChange = calculatePercentageChange(newCustomers, lastMonthNewCustomers);

  // Products
  const totalProducts = await prisma.product.count({
    where: { tenantId, isActive: true },
  });

  const lowStockProducts = await prisma.product.count({
    where: {
      tenantId,
      isActive: true,
      trackStock: true,
      stockQuantity: { lte: prisma.product.fields.lowStockAlert },
    },
  });

  // Recent orders
  const recentOrdersRaw = await prisma.order.findMany({
    where: {
      tenantId,
      status: { not: 'DRAFT' },
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Convert Decimal fields to numbers for client components
  const recentOrders = recentOrdersRaw.map(order => ({
    ...order,
    subtotal: Number(order.subtotal),
    taxAmount: order.taxAmount ? Number(order.taxAmount) : null,
    taxRate: order.taxRate ? Number(order.taxRate) : null,
    discount: order.discount ? Number(order.discount) : null,
    total: Number(order.total),
    giftCardAmount: order.giftCardAmount ? Number(order.giftCardAmount) : null,
    shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
    customer: order.customer ? {
      ...order.customer,
      totalSpent: Number(order.customer.totalSpent),
    } : null,
    items: order.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price),
        costPrice: item.product.costPrice ? Number(item.product.costPrice) : null,
        stockQuantity: item.product.stockQuantity ? Number(item.product.stockQuantity) : null,
        lowStockAlert: item.product.lowStockAlert ? Number(item.product.lowStockAlert) : null,
      } : null,
    })),
  }));

  // Revenue data for last 6 months
  const revenueData = [];
  for (let i = 5; i >= 0; i--) {
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

  // Top 5 products
  const topProducts = await prisma.orderItem.groupBy({
    by: ['name'],
    where: {
      order: {
        tenantId,
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        createdAt: { gte: startOfMonth },
      },
    },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  const topProductsData = topProducts.map((item) => ({
    name: item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name,
    fullName: item.name, // Nom complet pour le tooltip
    quantity: item._sum.quantity || 0,
  }));

  // Profit margin data for PRO/BUSINESS users
  let profitMarginData: Array<{ month: string; revenue: number; cost: number; profit: number; margin: number }> = [];
  let categorySalesData: Array<{ name: string; value: number; percentage: number }> = [];

  if (hasProAccess) {
    // Calculate profit margin for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      // Revenue
      const monthRevenue = await prisma.order.aggregate({
        where: {
          tenantId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { total: true, subtotal: true },
      });

      // Costs (from Finance module if available)
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

    // Category sales data for current month
    const categorySales = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          tenantId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
          createdAt: { gte: startOfMonth },
        },
      },
      _sum: { totalPrice: true },
    });

    // Get product categories
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

    // Group by category
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
      .slice(0, 7); // Top 7 categories
  }

  // Load and merge widget configuration
  const rawConfig = user.tenant.dashboardWidgetConfig as DashboardWidgetConfig | null;
  const userConfig = mergeWithDefaults(rawConfig);
  const widgetConfig = filterWidgetsByPlan(userConfig, user.tenant.plan);

  // Prepare dashboard data
  const dashboardData = {
    // Stats
    revenueValue: formatCurrency(totalCurrentRevenue, user.tenant.currency),
    revenueChange,
    ordersValue: currentOrders.toString(),
    ordersChange,
    customersValue: totalCustomers.toString(),
    customersSubtitle: `+${newCustomers} ce mois`,
    customersChange,
    productsValue: totalProducts.toString(),
    productsSubtitle: lowStockProducts > 0 ? `${lowStockProducts} en stock bas` : 'Stock OK',

    // Charts
    revenueData,
    topProductsData,
    profitMarginData,
    categorySalesData,

    // Recent orders
    recentOrders,

    // Other
    currency: user.tenant.currency,
    hasProAccess,
  };

  return (
    <>
      <DashboardClient
        initialConfig={widgetConfig}
        data={dashboardData}
        plan={user.tenant.plan}
      />

      {/* Tutorial Modal */}
      <TutorialWrapper showTutorial={!user.hasCompletedTutorial} />
    </>
  );
}
