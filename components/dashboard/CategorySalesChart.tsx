'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategorySalesChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  currency: string;
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-1">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          CA: <span className="font-bold text-blue-600">{payload[0].value.toFixed(2)} {currency}</span>
        </p>
        <p className="text-sm text-gray-600">
          Part: <span className="font-bold text-purple-600">{payload[0].payload.percentage.toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percentage
}: any) => {
  if (percentage < 5) return null; // N'affiche pas les labels pour les petites parts

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  );
};

export function CategorySalesChart({ data, currency, isLoading = false }: CategorySalesChartProps) {
  const hasData = data.length > 0 && data.some(d => d.value > 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ventes par Catégorie</h2>

      {hasData ? (
        <div className={`flex-1 min-h-[300px] relative ${isLoading ? 'opacity-50' : ''}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={(props) => <CustomTooltip {...props} currency={currency} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-sm">Aucune donnée de catégorie disponible</p>
            <p className="text-xs mt-2">Les ventes seront affichées ici une fois que vous aurez des produits avec catégories</p>
          </div>
        </div>
      )}
    </div>
  );
}
