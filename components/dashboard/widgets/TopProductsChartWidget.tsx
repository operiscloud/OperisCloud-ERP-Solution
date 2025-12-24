import { TopProductsChart } from '@/components/dashboard/TopProductsChart';

interface TopProductsChartWidgetProps {
  data: Array<{
    name: string;
    fullName?: string;
    quantity: number;
  }>;
  hasAccess: boolean;
  isLoading?: boolean;
}

export function TopProductsChartWidget({ data, hasAccess, isLoading = false }: TopProductsChartWidgetProps) {
  return <TopProductsChart data={data} hasAccess={hasAccess} isLoading={isLoading} />;
}
