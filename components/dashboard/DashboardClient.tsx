'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { WidgetSettingsModal } from './WidgetSettingsModal';
import { PeriodSelector, PeriodOption } from './PeriodSelector';
import { DashboardWidgetConfig, getVisibleWidgets } from '@/lib/dashboard/widget-config-helper';
import { Plan } from '@prisma/client';
import { RevenueStatsWidget } from './widgets/RevenueStatsWidget';
import { OrdersStatsWidget } from './widgets/OrdersStatsWidget';
import { CustomersStatsWidget } from './widgets/CustomersStatsWidget';
import { ProductsStatsWidget } from './widgets/ProductsStatsWidget';
import { RevenueChartWidget } from './widgets/RevenueChartWidget';
import { TopProductsChartWidget } from './widgets/TopProductsChartWidget';
import { ProfitMarginChartWidget } from './widgets/ProfitMarginChartWidget';
import { CategorySalesChartWidget } from './widgets/CategorySalesChartWidget';
import { RecentOrdersWidget } from './widgets/RecentOrdersWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';

interface DashboardData {
  // Stats
  revenueValue: string;
  revenueChange: number;
  ordersValue: string;
  ordersChange: number;
  customersValue: string;
  customersSubtitle: string;
  customersChange: number;
  productsValue: string;
  productsSubtitle: string;

  // Charts
  revenueData: Array<{ month: string; revenue: number }>;
  topProductsData: Array<{ name: string; fullName?: string; quantity: number }>;
  profitMarginData: Array<{ month: string; revenue: number; cost: number; profit: number; margin: number }>;
  categorySalesData: Array<{ name: string; value: number; percentage: number }>;

  // Recent orders
  recentOrders: any[];

  // Other
  currency: string;
  hasProAccess: boolean;
}

interface DashboardClientProps {
  initialConfig: DashboardWidgetConfig;
  data: DashboardData;
  plan: Plan;
}

export function DashboardClient({ initialConfig, data, plan }: DashboardClientProps) {
  const [config, setConfig] = useState(initialConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('30days');
  const [chartData, setChartData] = useState({
    revenueData: data.revenueData,
    topProductsData: data.topProductsData,
    profitMarginData: data.profitMarginData,
    categorySalesData: data.categorySalesData,
  });
  const [isLoadingPeriod, setIsLoadingPeriod] = useState(false);

  const visibleWidgets = getVisibleWidgets(config);

  // Fetch data when period changes
  useEffect(() => {
    const fetchPeriodData = async () => {
      setIsLoadingPeriod(true);
      try {
        const response = await fetch(`/api/dashboard/period-data?period=${selectedPeriod}`);
        if (!response.ok) throw new Error('Failed to fetch period data');

        const periodData = await response.json();
        setChartData({
          revenueData: periodData.revenueData,
          topProductsData: periodData.topProductsData,
          profitMarginData: periodData.profitMarginData,
          categorySalesData: periodData.categorySalesData,
        });
      } catch (err) {
        console.error('Error fetching period data:', err);
      } finally {
        setIsLoadingPeriod(false);
      }
    };

    fetchPeriodData();
  }, [selectedPeriod]);

  const saveConfig = async (newConfig: DashboardWidgetConfig) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/dashboard/widget-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setConfig(newConfig);
      setShowSettings(false);
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Erreur lors de la sauvegarde de la configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const renderWidget = (widgetId: string, locked: boolean = false) => {
    switch (widgetId) {
      case 'revenue-stats':
        return <RevenueStatsWidget value={data.revenueValue} change={data.revenueChange} />;
      case 'orders-stats':
        return <OrdersStatsWidget value={data.ordersValue} change={data.ordersChange} />;
      case 'customers-stats':
        return <CustomersStatsWidget value={data.customersValue} subtitle={data.customersSubtitle} change={data.customersChange} />;
      case 'products-stats':
        return <ProductsStatsWidget value={data.productsValue} subtitle={data.productsSubtitle} />;
      case 'revenue-chart':
        return <RevenueChartWidget data={chartData.revenueData} currency={data.currency} isLoading={isLoadingPeriod} hasAccess={!locked} />;
      case 'top-products-chart':
        return <TopProductsChartWidget data={chartData.topProductsData} hasAccess={!locked} isLoading={isLoadingPeriod} />;
      case 'profit-margin-chart':
        return <ProfitMarginChartWidget data={chartData.profitMarginData} currency={data.currency} isLoading={isLoadingPeriod} />;
      case 'category-sales-chart':
        return <CategorySalesChartWidget data={chartData.categorySalesData} currency={data.currency} isLoading={isLoadingPeriod} />;
      case 'recent-orders':
        return <RecentOrdersWidget orders={data.recentOrders} currency={data.currency} />;
      case 'quick-actions':
        return <QuickActionsWidget />;
      default:
        return null;
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 sm:col-span-1';
      case 'large':
        return 'col-span-1 sm:col-span-2 lg:col-span-2';
      default:
        return 'col-span-1';
    }
  };

  // Organize widgets by section
  const statWidgets = visibleWidgets.filter(w => w.section === 'stats');
  const chartWidgets = visibleWidgets.filter(w => w.section === 'charts');
  const advancedChartWidgets = visibleWidgets.filter(w => w.section === 'advanced-charts');
  const tableWidgets = visibleWidgets.filter(w => w.section === 'tables');
  const actionWidgets = visibleWidgets.filter(w => w.section === 'actions');

  return (
    <div className="space-y-6">
      {/* Page Header with Settings Button */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Vue d&apos;ensemble de votre activité</p>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Widgets
          </button>
        </div>

        {/* Period Selector */}
        {(chartWidgets.length > 0 || advancedChartWidgets.length > 0) && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              plan={plan}
            />
          </div>
        )}
      </div>

      {/* Stats Cards Grid - Always 4 columns on large screens */}
      {statWidgets.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statWidgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget.id, widget.locked)}
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid - Dynamic columns based on count */}
      {chartWidgets.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 ${chartWidgets.length === 1 ? '' : 'lg:grid-cols-2'}`}>
          {chartWidgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget.id, widget.locked)}
            </div>
          ))}
        </div>
      )}

      {/* Advanced Charts Grid - Dynamic columns based on count */}
      {advancedChartWidgets.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 ${advancedChartWidgets.length === 1 ? '' : 'lg:grid-cols-2'}`}>
          {advancedChartWidgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget.id, widget.locked)}
            </div>
          ))}
        </div>
      )}

      {/* Tables - Full width */}
      {tableWidgets.length > 0 && (
        <div className="space-y-6">
          {tableWidgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget.id, widget.locked)}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions - Full width */}
      {actionWidgets.length > 0 && (
        <div className="space-y-6">
          {actionWidgets.map((widget) => (
            <div key={widget.id}>
              {renderWidget(widget.id, widget.locked)}
            </div>
          ))}
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <WidgetSettingsModal
          config={config}
          plan={plan}
          onClose={() => setShowSettings(false)}
          onSave={saveConfig}
        />
      )}
    </div>
  );
}
