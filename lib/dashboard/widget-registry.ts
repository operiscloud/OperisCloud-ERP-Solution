import { LucideIcon, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export type WidgetSize = 'small' | 'medium' | 'large';
export type WidgetSection = 'stats' | 'charts' | 'advanced-charts' | 'tables' | 'actions';

export interface WidgetMetadata {
  id: string;
  name: string;
  description: string;
  section: WidgetSection;
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
  minPlanRequired?: 'FREE' | 'PRO' | 'BUSINESS';
  icon?: LucideIcon;
  requiresData?: boolean;
}

export const WIDGET_REGISTRY: Record<string, WidgetMetadata> = {
  'revenue-stats': {
    id: 'revenue-stats',
    name: 'Chiffre d\'affaires',
    description: 'Vue d\'ensemble du chiffre d\'affaires mensuel',
    section: 'stats',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    icon: DollarSign,
    requiresData: true,
  },
  'orders-stats': {
    id: 'orders-stats',
    name: 'Commandes',
    description: 'Nombre de commandes ce mois',
    section: 'stats',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    icon: ShoppingCart,
    requiresData: true,
  },
  'customers-stats': {
    id: 'customers-stats',
    name: 'Clients',
    description: 'Total clients et nouveaux clients',
    section: 'stats',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    icon: Users,
    requiresData: true,
  },
  'products-stats': {
    id: 'products-stats',
    name: 'Produits',
    description: 'Inventaire et alertes de stock',
    section: 'stats',
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium'],
    icon: Package,
    requiresData: true,
  },
  'revenue-chart': {
    id: 'revenue-chart',
    name: 'Revenus (6 mois)',
    description: 'Graphique des revenus des 6 derniers mois',
    section: 'charts',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    minPlanRequired: 'PRO',
    requiresData: true,
  },
  'top-products-chart': {
    id: 'top-products-chart',
    name: 'Top 5 Produits',
    description: 'Produits les plus vendus',
    section: 'charts',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    minPlanRequired: 'PRO',
    requiresData: true,
  },
  'profit-margin-chart': {
    id: 'profit-margin-chart',
    name: 'Marge Bénéficiaire',
    description: 'Évolution de la marge bénéficiaire',
    section: 'advanced-charts',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    minPlanRequired: 'PRO',
    requiresData: true,
  },
  'category-sales-chart': {
    id: 'category-sales-chart',
    name: 'Ventes par Catégorie',
    description: 'Répartition des ventes par catégorie',
    section: 'advanced-charts',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    minPlanRequired: 'PRO',
    requiresData: true,
  },
  'recent-orders': {
    id: 'recent-orders',
    name: 'Commandes Récentes',
    description: 'Les 5 dernières commandes',
    section: 'tables',
    defaultSize: 'large',
    allowedSizes: ['large'],
    requiresData: true,
  },
  'quick-actions': {
    id: 'quick-actions',
    name: 'Actions Rapides',
    description: 'Raccourcis vers les actions courantes',
    section: 'actions',
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
    requiresData: false,
  },
};

export function getWidgetMetadata(widgetId: string): WidgetMetadata | undefined {
  return WIDGET_REGISTRY[widgetId];
}

export function getAllWidgets(): WidgetMetadata[] {
  return Object.values(WIDGET_REGISTRY);
}

export function getWidgetsBySection(section: WidgetSection): WidgetMetadata[] {
  return getAllWidgets().filter(w => w.section === section);
}
