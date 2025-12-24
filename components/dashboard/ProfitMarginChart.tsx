'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProfitMarginChartProps {
  data: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
  currency: string;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.month}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            CA: <span className="font-bold text-blue-600">{payload[0].value.toFixed(2)} {currency}</span>
          </p>
          <p className="text-gray-600">
            Coûts: <span className="font-bold text-red-600">{payload[1].value.toFixed(2)} {currency}</span>
          </p>
          <p className="text-gray-600">
            Bénéfice: <span className="font-bold text-green-600">{payload[2].value.toFixed(2)} {currency}</span>
          </p>
          <p className="text-gray-600">
            Marge: <span className="font-bold text-purple-600">{payload[3].value.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ProfitMarginChart({ data, currency, isLoading = false }: ProfitMarginChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution de la Marge Bénéficiaire</h2>

      <div className={`flex-1 min-h-[300px] relative ${isLoading ? 'opacity-50' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            label={{
              value: `Montant (${currency})`,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#374151', fontWeight: 600 }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            label={{
              value: 'Marge (%)',
              angle: 90,
              position: 'insideRight',
              style: { fontSize: 12, fill: '#374151', fontWeight: 600 }
            }}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} currency={currency} />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            iconType="line"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            name="Chiffre d'affaires"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="cost"
            name="Coûts"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="profit"
            name="Bénéfice"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margin"
            name="Marge (%)"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8b5cf6', r: 4 }}
          />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
