import Link from 'next/link';
import { formatCurrency, formatRelativeTime, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { Order, Customer, OrderItem, Product } from '@prisma/client';

type OrderWithDetails = Order & {
  customer: Customer | null;
  items: (OrderItem & { product: Product | null })[];
};

interface RecentOrdersProps {
  orders: OrderWithDetails[];
  currency: string;
}

export function RecentOrders({ orders, currency }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune commande pour le moment</p>
        <Link
          href="/sales/new"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
        >
          Créer votre première commande
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commande
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Articles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/sales/${order.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {order.customer
                    ? `${order.customer.firstName} ${order.customer.lastName || ''}`
                    : order.guestName || 'Client invité'}
                </div>
                {order.customer?.email && (
                  <div className="text-sm text-gray-500">{order.customer.email}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStatusColor(
                    order.status
                  )}`}
                >
                  {getOrderStatusLabel(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(Number(order.total), currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatRelativeTime(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
