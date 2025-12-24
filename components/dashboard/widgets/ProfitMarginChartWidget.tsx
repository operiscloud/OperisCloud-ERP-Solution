import { ProfitMarginChart } from '@/components/dashboard/ProfitMarginChart';

interface ProfitMarginChartWidgetProps {
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

export function ProfitMarginChartWidget({ data, currency, isLoading = false }: ProfitMarginChartWidgetProps) {
  return <ProfitMarginChart data={data} currency={currency} isLoading={isLoading} />;
}
