'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  totalOrders: number;
  totalSpent: number;
}

interface CustomersListProps {
  customers: Customer[];
  currency: string;
  isCustomerLimitReached: boolean;
}

export default function CustomersList({
  customers,
  currency,
  isCustomerLimitReached
}: CustomersListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const email = customer.email?.toLowerCase() || '';
    const phone = customer.phone?.toLowerCase() || '';

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower)
    );
  });

  if (customers.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client</h3>
        <p className="text-gray-600 mb-4">Ajoutez votre premier client</p>
        {isCustomerLimitReached ? (
          <div className="inline-block">
            <button
              disabled
              className="inline-flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed opacity-60"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau client
            </button>
            <p className="text-xs text-red-600 mt-2">Limite de clients atteinte</p>
          </div>
        ) : (
          <Link
            href="/crm/new"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau client
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <SearchBar
          placeholder="Rechercher par nom, email ou téléphone..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Aucun client trouvé pour "{searchQuery}"</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total dépensé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ajouté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(Number(customer.totalSpent), currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatRelativeTime(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/crm/${customer.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Modifier
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
