import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Users, LayoutGrid, X } from 'lucide-react';
import { getPlan } from '@/lib/plans';
import NewCustomerButton from '@/components/crm/NewCustomerButton';
import CustomersList from '@/components/crm/CustomersList';

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true, plan: true } } },
  });

  if (!user) redirect('/onboarding');

  // Get plan info
  const plan = getPlan(user.tenant.plan);

  const params = await searchParams;
  const segmentId = params.segment;

  // Get segment info if filtering by segment
  let segment = null;
  if (segmentId) {
    segment = await prisma.segment.findFirst({
      where: { id: segmentId, tenantId: user.tenantId },
    });
  }

  const customers = await prisma.customer.findMany({
    where: {
      tenantId: user.tenantId,
      ...(segmentId && { segmentId }),
    },
    include: {
      orders: {
        select: {
          total: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate order count and total spent for each customer
  // Convert Decimal to number for client components
  const customersWithStats = customers.map((customer) => ({
    ...customer,
    orders: customer.orders.map(order => ({
      total: Number(order.total),
    })),
    totalOrders: customer.orders.length,
    totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.total), 0),
  }));

  // Calculate customer usage percentage
  const totalCustomers = customers.length;
  const customersPercentage = plan.limits.maxCustomers === 0 ? 0 : Math.min(100, (totalCustomers / plan.limits.maxCustomers) * 100);
  const isCustomerLimitReached = plan.limits.maxCustomers > 0 && totalCustomers >= plan.limits.maxCustomers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Gérez votre base clients</p>
          {segment && (
            <div className="mt-2">
              <Link
                href="/crm"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: segment.color + '20', color: segment.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                {segment.name}
                <X className="h-4 w-4 hover:opacity-70" />
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/crm/segments"
            className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium"
          >
            <LayoutGrid className="h-5 w-5 mr-2" />
            Segments
          </Link>
          <NewCustomerButton />
        </div>
      </div>

      {/* Customer Usage Progress Bar */}
      {plan.limits.maxCustomers > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Utilisation des clients
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {totalCustomers} / {plan.limits.maxCustomers}
              </span>
              {customersPercentage >= 80 && (
                <Link
                  href="/pricing"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Passer à PRO →
                </Link>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                customersPercentage >= 90
                  ? 'bg-red-600'
                  : customersPercentage >= 70
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
              }`}
              style={{ width: `${customersPercentage}%` }}
            ></div>
          </div>
          {customersPercentage == 100 && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Vous avez atteint la limite de votre plan. Passez à un plan supérieur pour ajouter plus de clients.
            </p>
          )}
          {customersPercentage >= 90 && customersPercentage < 99 && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Vous avez presque atteint la limite de votre plan. Passez à un plan supérieur pour ajouter plus de clients.
            </p>
          )}
          {customersPercentage >= 70 && customersPercentage < 90 && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Vous approchez de la limite de votre plan ({Math.round(customersPercentage)}% utilisé).
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <CustomersList
          customers={customersWithStats}
          currency={user.tenant.currency}
          isCustomerLimitReached={isCustomerLimitReached}
        />
      </div>
    </div>
  );
}
