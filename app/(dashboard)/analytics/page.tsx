'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Gift,
  Filter,
  Lock,
} from 'lucide-react';
import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import Link from 'next/link';

type DateFilter = '7days' | '30days' | '3months' | '1year' | 'all' | 'custom';

interface AnalyticsData {
  currentRevenue: number;
  previousRevenue: number;
  currentOrderCount: number;
  previousOrderCount: number;
  confirmedOrders: number;
  draftOrders: number;
  totalCustomers: number;
  totalProducts: number;
  currentExpenses: number;
  profit: number;
  profitMargin: number;
  averageOrderValue: number;
  totalGiftCardsSold: number;
  totalGiftCardUsed: number;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stockQuantity: number;
    lowStockAlert: number;
  }>;
  dailyRevenue: { [key: string]: number };
  currency: string;
}

export default function ReportsPage() {
  const { hasAccess: hasAdvancedAnalytics } = usePlanFeature('hasAdvancedAnalytics');
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const getFilterLabel = () => {
    switch (dateFilter) {
      case '7days':
        return '7 derniers jours';
      case '30days':
        return '30 derniers jours';
      case '3months':
        return '3 derniers mois';
      case '1year':
        return 'Dernière année';
      case 'all':
        return 'Depuis le début';
      case 'custom':
        return 'Période personnalisée';
      default:
        return '';
    }
  };

  // Debounce custom dates to avoid too many API calls while typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAnalytics();
    }, 1000); // Wait 1 second after last change before fetching

    return () => clearTimeout(timeoutId);
  }, [dateFilter, customStartDate, customEndDate]);

  const fetchAnalytics = async () => {
    // Don't fetch if custom filter is selected but dates are not set
    if (dateFilter === 'custom' && (!customStartDate || !customEndDate)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('filter', dateFilter);
      if (dateFilter === 'custom' && customStartDate && customEndDate) {
        params.append('startDate', customStartDate);
        params.append('endDate', customEndDate);
      }

      const response = await fetch(`/api/analytics?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des statistiques...</div>
      </div>
    );
  }

  // Show message when custom filter is selected but dates are not set
  if (dateFilter === 'custom' && (!customStartDate || !customEndDate)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
            <p className="text-gray-600">Vue d'ensemble de vos performances - {getFilterLabel()}</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Période</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setDateFilter('7days')}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-blue-600 transition-colors"
            >
              7 derniers jours
            </button>
            <button
              onClick={() => setDateFilter('30days')}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-blue-600 transition-colors"
            >
              Dernier mois
            </button>
            <button
              onClick={() => setDateFilter('3months')}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-blue-600 transition-colors"
            >
              3 derniers mois
            </button>
            <button
              onClick={() => setDateFilter('1year')}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-blue-600 transition-colors"
            >
              Dernière année
            </button>
            <button
              onClick={() => setDateFilter('all')}
              className="px-4 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:border-blue-600 transition-colors"
            >
              Depuis le début
            </button>
            <button
              onClick={() => setDateFilter('custom')}
              className="px-4 py-2 rounded-lg border bg-blue-600 text-white border-blue-600 transition-colors"
            >
              Personnalisé
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Message to select dates */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sélectionnez une période personnalisée
          </h3>
          <p className="text-gray-600">
            Veuillez choisir une date de début et une date de fin pour afficher les statistiques
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Aucune donnée disponible</div>
      </div>
    );
  }

  const revenueChange =
    data.previousRevenue > 0
      ? ((data.currentRevenue - data.previousRevenue) / data.previousRevenue) * 100
      : 0;

  const orderCountChange =
    data.previousOrderCount > 0
      ? ((data.currentOrderCount - data.previousOrderCount) / data.previousOrderCount) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
          <p className="text-gray-600">Vue d'ensemble de vos performances - {getFilterLabel()}</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Période</h2>
        </div>

        {!hasAdvancedAnalytics && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              📊 Avec le plan gratuit, vous voyez les 7 derniers jours.{' '}
              <Link href="/pricing" className="font-semibold text-yellow-900 underline">
                Passez à Pro pour voir jusqu'à 1 an d'historique
              </Link>
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setDateFilter('7days')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              dateFilter === '7days'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            7 derniers jours
          </button>
          <button
            onClick={() => hasAdvancedAnalytics && setDateFilter('30days')}
            disabled={!hasAdvancedAnalytics}
            className={`px-4 py-2 rounded-lg border transition-colors relative ${
              !hasAdvancedAnalytics
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : dateFilter === '30days'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            Dernier mois
            {!hasAdvancedAnalytics && <Lock className="h-3 w-3 inline-block ml-1" />}
          </button>
          <button
            onClick={() => hasAdvancedAnalytics && setDateFilter('3months')}
            disabled={!hasAdvancedAnalytics}
            className={`px-4 py-2 rounded-lg border transition-colors relative ${
              !hasAdvancedAnalytics
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : dateFilter === '3months'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            3 derniers mois
            {!hasAdvancedAnalytics && <Lock className="h-3 w-3 inline-block ml-1" />}
          </button>
          <button
            onClick={() => hasAdvancedAnalytics && setDateFilter('1year')}
            disabled={!hasAdvancedAnalytics}
            className={`px-4 py-2 rounded-lg border transition-colors relative ${
              !hasAdvancedAnalytics
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : dateFilter === '1year'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            Dernière année
            {!hasAdvancedAnalytics && <Lock className="h-3 w-3 inline-block ml-1" />}
          </button>
          <button
            onClick={() => hasAdvancedAnalytics && setDateFilter('all')}
            disabled={!hasAdvancedAnalytics}
            className={`px-4 py-2 rounded-lg border transition-colors relative ${
              !hasAdvancedAnalytics
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : dateFilter === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            Depuis le début
            {!hasAdvancedAnalytics && <Lock className="h-3 w-3 inline-block ml-1" />}
          </button>
          <button
            onClick={() => hasAdvancedAnalytics && setDateFilter('custom')}
            disabled={!hasAdvancedAnalytics}
            className={`px-4 py-2 rounded-lg border transition-colors relative ${
              !hasAdvancedAnalytics
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : dateFilter === 'custom'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
            }`}
          >
            Personnalisé
            {!hasAdvancedAnalytics && <Lock className="h-3 w-3 inline-block ml-1" />}
          </button>
        </div>

        {dateFilter === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            {revenueChange !== 0 && (
              <div
                className={`flex items-center text-sm font-medium ${
                  revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {revenueChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(revenueChange).toFixed(1)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Chiffre d'affaires</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {data.currentRevenue.toFixed(2)} {data.currency}
            </p>
            <p className="text-xs text-gray-500 mt-1">{getFilterLabel()}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            {orderCountChange !== 0 && (
              <div
                className={`flex items-center text-sm font-medium ${
                  orderCountChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {orderCountChange > 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(orderCountChange).toFixed(1)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Commandes</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{data.currentOrderCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              {data.confirmedOrders} confirmées, {data.draftOrders} brouillons
            </p>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Clients</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">Total enregistrés</p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Produits actifs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">En inventaire</p>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Panier moyen</p>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.averageOrderValue.toFixed(2)} {data.currency}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Dépenses</p>
            <DollarSign className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.currentExpenses.toFixed(2)} {data.currency}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Marge bénéficiaire</p>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.profitMargin.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">
            Profit: {data.profit.toFixed(2)} {data.currency}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Bons cadeaux</p>
            <Gift className="h-5 w-5 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {data.totalGiftCardsSold.toFixed(2)} {data.currency}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Utilisés: {data.totalGiftCardUsed.toFixed(2)} {data.currency}
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {data.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-orange-600" />
            Alerte stock faible ({data.lowStockProducts.length})
          </h2>
          <div className="space-y-3">
            {data.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Stock actuel: {product.stockQuantity} unités
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  Seuil: {product.lowStockAlert}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Chiffre d'affaires journalier
        </h2>
        <div className="space-y-2">
          {Object.entries(data.dailyRevenue)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .slice(0, 15)
            .map(([date, revenue]) => {
              const maxRevenue = Math.max(...Object.values(data.dailyRevenue));
              const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

              return (
                <div key={date} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24">
                    {new Date(date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div
                      className="bg-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-white text-sm font-medium">
                          {revenue.toFixed(2)} {data.currency}
                        </span>
                      )}
                    </div>
                  </div>
                  {percentage <= 20 && (
                    <span className="text-sm text-gray-900 font-medium w-32 text-right">
                      {revenue.toFixed(2)} {data.currency}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
