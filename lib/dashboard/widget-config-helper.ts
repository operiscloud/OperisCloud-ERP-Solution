import { Plan } from '@prisma/client';
import { WIDGET_REGISTRY, WidgetSize, WidgetSection } from './widget-registry';

export interface WidgetConfig {
  id: string;
  visible: boolean;
  order: number;
  size: WidgetSize;
  section: WidgetSection;
  locked?: boolean; // Widget is visible but requires upgrade
}

export interface DashboardWidgetConfig {
  widgets: WidgetConfig[];
  layout: {
    version: number;
    lastUpdated: string;
  };
}

export const DEFAULT_WIDGET_CONFIG: DashboardWidgetConfig = {
  widgets: [
    { id: 'revenue-stats', visible: true, order: 0, size: 'medium', section: 'stats' },
    { id: 'orders-stats', visible: true, order: 1, size: 'medium', section: 'stats' },
    { id: 'customers-stats', visible: true, order: 2, size: 'medium', section: 'stats' },
    { id: 'products-stats', visible: true, order: 3, size: 'medium', section: 'stats' },
    { id: 'revenue-chart', visible: true, order: 4, size: 'large', section: 'charts' },
    { id: 'top-products-chart', visible: true, order: 5, size: 'large', section: 'charts' },
    { id: 'profit-margin-chart', visible: true, order: 6, size: 'large', section: 'advanced-charts' },
    { id: 'category-sales-chart', visible: true, order: 7, size: 'large', section: 'advanced-charts' },
    { id: 'recent-orders', visible: true, order: 8, size: 'large', section: 'tables' },
    { id: 'quick-actions', visible: true, order: 9, size: 'large', section: 'actions' },
  ],
  layout: {
    version: 1,
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Filter widgets based on user's plan
 * Widgets requiring higher plan are marked as locked instead of removed
 */
export function filterWidgetsByPlan(
  config: DashboardWidgetConfig,
  userPlan: Plan
): DashboardWidgetConfig {
  const planHierarchy = { FREE: 0, PRO: 1, BUSINESS: 2 };

  // Widgets that show paywall for FREE users (visible but locked)
  const paywallWidgetIds = ['revenue-chart', 'top-products-chart'];

  const processedWidgets = config.widgets
    .map((widget) => {
      const metadata = WIDGET_REGISTRY[widget.id];
      if (!metadata) return null;

      // No plan requirement - always accessible
      if (!metadata.minPlanRequired) {
        return { ...widget, locked: false };
      }

      const hasAccess = planHierarchy[userPlan] >= planHierarchy[metadata.minPlanRequired];

      // If no access and it's a paywall widget, show it locked
      if (!hasAccess && paywallWidgetIds.includes(widget.id)) {
        return { ...widget, locked: true };
      }

      // If no access and it's NOT a paywall widget, hide it completely
      if (!hasAccess) {
        return null;
      }

      // Has access - show unlocked
      return { ...widget, locked: false };
    })
    .filter((w): w is WidgetConfig => w !== null);

  return {
    ...config,
    widgets: processedWidgets,
  };
}

/**
 * Get visible widgets sorted by order
 */
export function getVisibleWidgets(config: DashboardWidgetConfig): WidgetConfig[] {
  return config.widgets
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);
}

/**
 * Merge user config with defaults (for migration/new widgets)
 */
export function mergeWithDefaults(
  userConfig: DashboardWidgetConfig | null
): DashboardWidgetConfig {
  if (!userConfig) return DEFAULT_WIDGET_CONFIG;

  const existingIds = new Set(userConfig.widgets.map(w => w.id));
  const newWidgets = DEFAULT_WIDGET_CONFIG.widgets.filter(
    w => !existingIds.has(w.id)
  );

  return {
    widgets: [...userConfig.widgets, ...newWidgets],
    layout: userConfig.layout,
  };
}
