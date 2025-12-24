import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users } from 'lucide-react';

interface CustomersStatsWidgetProps {
  value: string;
  subtitle: string;
  change: number;
}

export function CustomersStatsWidget({ value, subtitle, change }: CustomersStatsWidgetProps) {
  return (
    <StatsCard
      title="Clients"
      value={value}
      subtitle={subtitle}
      change={change}
      icon={Users}
      iconColor="text-purple-600"
      iconBg="bg-purple-100"
    />
  );
}
