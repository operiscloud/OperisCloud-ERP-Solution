import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, calculatePercentageChange } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { ProfitMarginChart } from '@/components/dashboard/ProfitMarginChart';
import { CategorySalesChart } from '@/components/dashboard/CategorySalesChart';
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
      tenant: { select: { currency: true, plan: true } }
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
  const recentOrders = await prisma.order.findMany({
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
  let profitMarginData = [];
  let categorySalesData = [];

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Chiffre d'affaires"
          value={formatCurrency(totalCurrentRevenue, user.tenant.currency)}
          change={revenueChange}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />

        <StatsCard
          title="Commandes"
          value={currentOrders.toString()}
          change={ordersChange}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />

        <StatsCard
          title="Clients"
          value={totalCustomers.toString()}
          subtitle={`+${newCustomers} ce mois`}
          change={customersChange}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="Produits"
          value={totalProducts.toString()}
          subtitle={lowStockProducts > 0 ? `${lowStockProducts} en stock bas` : 'Stock OK'}
          icon={Package}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} currency={user.tenant.currency} />
        <TopProductsChart data={topProductsData} hasAccess={hasProAccess} />
      </div>

      {/* Advanced Charts - PRO/BUSINESS only */}
      {hasProAccess && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProfitMarginChart data={profitMarginData} currency={user.tenant.currency} />
          <CategorySalesChart data={categorySalesData} currency={user.tenant.currency} />
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Commandes récentes
          </h2>
        </div>
        <RecentOrders orders={recentOrders} currency={user.tenant.currency} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/sales/new"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nouvelle commande</h3>
              <p className="text-sm text-gray-600">Créer une vente rapidement</p>
            </div>
          </div>
        </a>

        <a
          href="/inventory/new"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ajouter un produit</h3>
              <p className="text-sm text-gray-600">Enrichir votre catalogue</p>
            </div>
          </div>
        </a>

        <a
          href="/crm/new"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nouveau client</h3>
              <p className="text-sm text-gray-600">Ajouter à votre CRM</p>
            </div>
          </div>
        </a>
      </div>

      {/* Tutorial Modal */}
      <TutorialWrapper showTutorial={!user.hasCompletedTutorial} />
    </div>
  );
}
