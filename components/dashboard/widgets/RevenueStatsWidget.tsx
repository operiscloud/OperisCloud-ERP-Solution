import { StatsCard } from '@/components/dashboard/StatsCard';
import { DollarSign } from 'lucide-react';

interface RevenueStatsWidgetProps {
  value: string;
  change: number;
}

export function RevenueStatsWidget({ value, change }: RevenueStatsWidgetProps) {
  return (
    <StatsCard
      title="Chiffre d'affaires"
      value={value}
      change={change}
      icon={DollarSign}
      iconColor="text-green-600"
      iconBg="bg-green-100"
    />
  );
}
