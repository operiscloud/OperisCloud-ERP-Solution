'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TopProductsChartProps {
  data: Array<{
    name: string;
    fullName?: string; // Nom complet non tronqué
    quantity: number;
  }>;
  hasAccess?: boolean;
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Custom tooltip pour afficher le nom complet
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.fullName || payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">
          Quantité: <span className="font-bold text-blue-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function TopProductsChart({ data, hasAccess = true, isLoading = false }: TopProductsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Produits les Plus Vendus</h2>

      {/* Chart content with blur when locked */}
      <div className={`flex-1 min-h-[350px] relative ${hasAccess ? '' : 'blur-sm pointer-events-none select-none'} ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading && hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.length > 0 ? data : [
              { name: 'Produit 1', quantity: 45 },
              { name: 'Produit 2', quantity: 38 },
              { name: 'Produit 3', quantity: 32 },
              { name: 'Produit 4', quantity: 28 },
              { name: 'Produit 5', quantity: 22 },
            ]}
            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              angle={-35}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              label={{
                value: 'Quantité Vendue',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#374151', fontWeight: 600 }
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
            <Bar
              dataKey="quantity"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            >
              {(data.length > 0 ? data : [
                { name: 'Produit 1', quantity: 45 },
                { name: 'Produit 2', quantity: 38 },
                { name: 'Produit 3', quantity: 32 },
                { name: 'Produit 4', quantity: 28 },
                { name: 'Produit 5', quantity: 22 },
              ]).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Paywall overlay */}
      {!hasAccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-lg">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center border-2 border-blue-200">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fonctionnalité PRO
            </h3>

            <p className="text-gray-600 mb-6">
              Accédez aux statistiques détaillées de vos produits les plus vendus et optimisez votre stratégie commerciale
            </p>

            <Link
              href="/pricing"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Passer à PRO
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>

            <p className="text-sm text-gray-500 mt-4">
              À partir de 29 CHF/mois
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
