import { StatsCard } from '@/components/dashboard/StatsCard';
import { ShoppingCart } from 'lucide-react';

interface OrdersStatsWidgetProps {
  value: string;
  change: number;
}

export function OrdersStatsWidget({ value, change }: OrdersStatsWidgetProps) {
  return (
    <StatsCard
      title="Commandes"
      value={value}
      change={change}
      icon={ShoppingCart}
      iconColor="text-blue-600"
      iconBg="bg-blue-100"
    />
  );
}
