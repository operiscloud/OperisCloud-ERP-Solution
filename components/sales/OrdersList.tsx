'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ShoppingCart } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { formatCurrency, formatRelativeTime, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  customer: {
    firstName: string;
    lastName: string | null;
  } | null;
  guestName: string | null;
  items: {
    id: string;
  }[];
}

interface OrdersListProps {
  orders: Order[];
  currency: string;
}

export default function OrdersList({ orders, currency }: OrdersListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const orderNumber = order.orderNumber.toLowerCase();
    const customerName = order.customer
      ? `${order.customer.firstName} ${order.customer.lastName || ''}`.toLowerCase()
      : (order.guestName || 'client invité').toLowerCase();
    const status = getOrderStatusLabel(order.status).toLowerCase();

    return (
      orderNumber.includes(searchLower) ||
      customerName.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-600 mb-4">Créez votre première commande</p>
        <Link
          href="/sales/new"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle commande
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <SearchBar
          placeholder="Rechercher par numéro, client ou statut..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Aucune commande trouvée pour "{searchQuery}"</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Articles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName || ''}`
                        : order.guestName || 'Client invité'}
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/sales/${order.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
