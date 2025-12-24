import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconColor,
  iconBg,
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-1">
        <div className="flex-1 min-h-[120px] flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="mt-auto pt-2">
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            {change !== undefined && (
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs mois dernier</span>
              </div>
            )}
          </div>
        </div>
        <div className={cn('p-3 rounded-lg', iconBg)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
