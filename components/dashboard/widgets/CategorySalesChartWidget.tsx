import { CategorySalesChart } from '@/components/dashboard/CategorySalesChart';

interface CategorySalesChartWidgetProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  currency: string;
  isLoading?: boolean;
}

export function CategorySalesChartWidget({ data, currency, isLoading = false }: CategorySalesChartWidgetProps) {
  return <CategorySalesChart data={data} currency={currency} isLoading={isLoading} />;
}
