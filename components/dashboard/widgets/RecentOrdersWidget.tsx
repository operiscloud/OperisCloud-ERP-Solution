import { RecentOrders } from '@/components/dashboard/RecentOrders';

interface RecentOrdersWidgetProps {
  orders: any[];
  currency: string;
}

export function RecentOrdersWidget({ orders, currency }: RecentOrdersWidgetProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Commandes récentes
        </h2>
      </div>
      <RecentOrders orders={orders} currency={currency} />
    </div>
  );
}
