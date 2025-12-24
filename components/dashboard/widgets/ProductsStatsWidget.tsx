import { StatsCard } from '@/components/dashboard/StatsCard';
import { Package } from 'lucide-react';

interface ProductsStatsWidgetProps {
  value: string;
  subtitle: string;
}

export function ProductsStatsWidget({ value, subtitle }: ProductsStatsWidgetProps) {
  return (
    <StatsCard
      title="Produits"
      value={value}
      subtitle={subtitle}
      icon={Package}
      iconColor="text-orange-600"
      iconBg="bg-orange-100"
    />
  );
}
