'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Expense {
  id: string;
  title: string;
  description: string | null;
  category: string;
  amount: number;
  date: Date;
}

interface ExpensesListProps {
  expenses: Expense[];
  currency: string;
}

export default function ExpensesList({ expenses, currency }: ExpensesListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase();
    const title = expense.title.toLowerCase();
    const description = expense.description?.toLowerCase() || '';
    const category = expense.category.toLowerCase();
    const amount = expense.amount.toString();

    return (
      title.includes(searchLower) ||
      description.includes(searchLower) ||
      category.includes(searchLower) ||
      amount.includes(searchLower)
    );
  });

  if (expenses.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune dépense</h3>
        <p className="text-gray-600 mb-4">Commencez à suivre vos dépenses</p>
        <Link
          href="/finance/new"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle dépense
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Dépenses récentes</h2>
        <SearchBar
          placeholder="Rechercher une dépense..."
          onSearch={setSearchQuery}
        />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune dépense trouvée</h3>
          <p className="text-gray-600">Essayez de modifier votre recherche</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{expense.title}</div>
                    {expense.description && (
                      <div className="text-sm text-gray-500">{expense.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {formatCurrency(Number(expense.amount), currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(expense.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/finance/expenses/${expense.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
