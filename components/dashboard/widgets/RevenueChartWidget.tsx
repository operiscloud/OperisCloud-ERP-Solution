import { RevenueChart } from '@/components/dashboard/RevenueChart';

interface RevenueChartWidgetProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
  currency: string;
  isLoading?: boolean;
  hasAccess?: boolean;
}

export function RevenueChartWidget({ data, currency, isLoading = false, hasAccess = true }: RevenueChartWidgetProps) {
  return <RevenueChart data={data} currency={currency} isLoading={isLoading} hasAccess={hasAccess} />;
}
