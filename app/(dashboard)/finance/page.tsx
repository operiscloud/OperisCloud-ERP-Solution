import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import ExpensesList from '@/components/finance/ExpensesList';
import { getPlan } from '@/lib/plans';
import FeaturePaywallPage from '@/components/paywall/FeaturePaywallPage';

export default async function FinancePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true, plan: true } } },
  });

  if (!user) redirect('/onboarding');

  // Check plan access server-side
  const plan = getPlan(user.tenant.plan);
  if (!plan.features.hasFinanceModule) {
    return <FeaturePaywallPage feature="finance" />;
  }

  const [expenses, orders, giftCards] = await Promise.all([
    prisma.expense.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { date: 'desc' },
    }),
    // Get revenue from orders
    prisma.order.findMany({
      where: {
        tenantId: user.tenantId,
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
    }),
    // Get revenue from gift cards sold
    prisma.giftCard.findMany({
      where: { tenantId: user.tenantId },
      select: { initialAmount: true },
    }),
  ]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Calculate total revenue (orders + gift cards sold)
  const ordersRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const giftCardsRevenue = giftCards.reduce((sum, gc) => sum + Number(gc.initialAmount), 0);
  const totalRevenue = ordersRevenue + giftCardsRevenue;

  const profit = totalRevenue - totalExpenses;

  // Convert Decimal to number for client components
  const expensesForClient = expenses.map(expense => ({
    ...expense,
    amount: Number(expense.amount),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
          <p className="text-gray-600">Suivez vos dépenses et revenus</p>
        </div>
        <Link
          href="/finance/new"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle dépense
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(totalRevenue, user.tenant.currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dépenses</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(totalExpenses, user.tenant.currency)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bénéfice</p>
              <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit, user.tenant.currency)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {profit >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow">
        <ExpensesList expenses={expensesForClient} currency={user.tenant.currency} />
      </div>
    </div>
  );
}
