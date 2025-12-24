import { Plan, PlanType } from './types/plans';

export const PLANS: Record<PlanType, Plan> = {
  FREE: {
    id: 'FREE',
    name: 'Gratuit',
    description: 'Parfait pour démarrer et tester',
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      maxProducts: 50,
      maxOrdersPerMonth: 30,
      maxCustomers: 25,
      maxUsers: 1,
      maxCategories: 3,
      dataRetentionDays: 30,
    },
    features: {
      // Basic modules only
      hasVariants: false,
      hasGiftCards: false,
      hasFinanceModule: false,
      hasAdvancedAnalytics: false,
      hasPdfGeneration: false,
      hasImportExcel: false,
      hasMultiChannel: false,
      hasLowStockAlerts: false,
      hasInvoiceReminders: false,
      hasBarcodeScanner: false,

      // No advanced features
      hasAdvancedSegmentation: false,
      hasCustomerSegmentation: false,
      hasRolesPermissions: false,
      hasApiAccess: false,
      hasCustomFields: false,
      hasAutomations: false,
      hasMultiCurrency: false,

      // No enterprise features
      hasWhiteLabel: false,
      hasDedicatedSupport: false,
      hasSLA: false,
    },
  },

  PRO: {
    id: 'PRO',
    name: 'Pro',
    description: 'Pour les petites entreprises en croissance',
    price: {
      monthly: 29,
      yearly: 290, // ~2 months free
    },
    limits: {
      maxProducts: 500,
      maxOrdersPerMonth: 200,
      maxCustomers: 0, // unlimited
      maxUsers: 3,
      maxCategories: 10,
      dataRetentionDays: 365,
    },
    features: {
      // All basic + advanced modules
      hasVariants: true,
      hasGiftCards: true,
      hasFinanceModule: true,
      hasAdvancedAnalytics: true,
      hasPdfGeneration: true,
      hasImportExcel: true,
      hasMultiChannel: true,
      hasLowStockAlerts: true,
      hasInvoiceReminders: true,
      hasBarcodeScanner: true,

      // Some advanced features
      hasAdvancedSegmentation: false,
      hasCustomerSegmentation: false,
      hasRolesPermissions: false,
      hasApiAccess: false,
      hasCustomFields: false,
      hasAutomations: false,
      hasMultiCurrency: false,

      // No enterprise features
      hasWhiteLabel: false,
      hasDedicatedSupport: false,
      hasSLA: false,
    },
    popular: true,
  },

  BUSINESS: {
    id: 'BUSINESS',
    name: 'Business',
    description: 'Pour les entreprises établies avec équipes',
    price: {
      monthly: 69,
      yearly: 690, // ~2 months free
    },
    limits: {
      maxProducts: 0, // unlimited
      maxOrdersPerMonth: 0, // unlimited
      maxCustomers: 0, // unlimited
      maxUsers: 10,
      maxCategories: 0, // unlimited
      dataRetentionDays: 0, // unlimited
    },
    features: {
      // All PRO features
      hasVariants: true,
      hasGiftCards: true,
      hasFinanceModule: true,
      hasAdvancedAnalytics: true,
      hasPdfGeneration: true,
      hasImportExcel: true,
      hasMultiChannel: true,
      hasLowStockAlerts: true,
      hasInvoiceReminders: true,
      hasBarcodeScanner: true,

      // All advanced features
      hasAdvancedSegmentation: true,
      hasCustomerSegmentation: true,
      hasRolesPermissions: true,
      hasApiAccess: true,
      hasCustomFields: true,
      hasAutomations: true,
      hasMultiCurrency: true,

      // No enterprise features yet
      hasWhiteLabel: false,
      hasDedicatedSupport: false,
      hasSLA: false,
    },
  },

  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'Pour les grandes entreprises',
    price: {
      monthly: 0, // Custom pricing
      yearly: 0, // Custom pricing
    },
    limits: {
      maxProducts: 0, // unlimited
      maxOrdersPerMonth: 0, // unlimited
      maxCustomers: 0, // unlimited
      maxUsers: 0, // unlimited
      maxCategories: 0, // unlimited
      dataRetentionDays: 0, // unlimited
    },
    features: {
      // All BUSINESS features
      hasVariants: true,
      hasGiftCards: true,
      hasFinanceModule: true,
      hasAdvancedAnalytics: true,
      hasPdfGeneration: true,
      hasImportExcel: true,
      hasMultiChannel: true,
      hasLowStockAlerts: true,
      hasInvoiceReminders: true,
      hasBarcodeScanner: true,

      // All advanced features
      hasAdvancedSegmentation: true,
      hasCustomerSegmentation: true,
      hasRolesPermissions: true,
      hasApiAccess: true,
      hasCustomFields: true,
      hasAutomations: true,
      hasMultiCurrency: true,

      // Enterprise features
      hasWhiteLabel: true,
      hasDedicatedSupport: true,
      hasSLA: true,
    },
  },
};

// Helper function to get plan by ID
export function getPlan(planId: PlanType): Plan {
  return PLANS[planId];
}

// Helper function to check if a feature is available for a plan
export function hasFeature(planId: PlanType, feature: keyof Plan['features']): boolean {
  return PLANS[planId].features[feature];
}

// Helper function to get limit value
export function getLimit(planId: PlanType, limit: keyof Plan['limits']): number {
  return PLANS[planId].limits[limit];
}

// Helper function to check if usage is within limits
export function isWithinLimit(
  planId: PlanType,
  limit: keyof Plan['limits'],
  currentUsage: number
): boolean {
  const limitValue = getLimit(planId, limit);
  // 0 means unlimited
  if (limitValue === 0) return true;
  return currentUsage < limitValue;
}

// Helper to calculate percentage of limit used
export function getLimitPercentage(
  planId: PlanType,
  limit: keyof Plan['limits'],
  currentUsage: number
): number {
  const limitValue = getLimit(planId, limit);
  // 0 means unlimited
  if (limitValue === 0) return 0;
  return Math.min(100, (currentUsage / limitValue) * 100);
}
