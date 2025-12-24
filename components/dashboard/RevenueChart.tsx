'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
  currency: string;
  isLoading?: boolean;
  hasAccess?: boolean;
}

export function RevenueChart({ data, currency, isLoading = false, hasAccess = true }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenus</h2>

      {/* Chart content with blur when locked */}
      <div className={`flex-1 min-h-[300px] relative ${hasAccess ? '' : 'blur-sm pointer-events-none select-none'} ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading && hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} ${currency}`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} ${currency}`, 'Revenus']}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
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
              Accédez aux graphiques détaillés de vos revenus et suivez l&apos;évolution de votre activité sur différentes périodes
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
