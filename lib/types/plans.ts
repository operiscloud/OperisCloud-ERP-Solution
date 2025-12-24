// Plan types and feature definitions
export type PlanType = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface PlanLimits {
  maxProducts: number;
  maxOrdersPerMonth: number;
  maxCustomers: number;
  maxUsers: number;
  maxCategories: number; // 0 = unlimited
  dataRetentionDays: number; // 0 = unlimited
}

export interface PlanFeatures {
  // Modules
  hasVariants: boolean;
  hasGiftCards: boolean;
  hasFinanceModule: boolean;
  hasAdvancedAnalytics: boolean;
  hasPdfGeneration: boolean;
  hasImportExcel: boolean;
  hasMultiChannel: boolean;
  hasLowStockAlerts: boolean;
  hasInvoiceReminders: boolean; // Rappels de paiement automatiques
  hasBarcodeScanner: boolean; // Scanner de code-barres mobile

  // Advanced features (BUSINESS+)
  hasAdvancedSegmentation: boolean;
  hasCustomerSegmentation: boolean; // Alias for hasAdvancedSegmentation
  hasRolesPermissions: boolean;
  hasApiAccess: boolean;
  hasCustomFields: boolean;
  hasAutomations: boolean;
  hasMultiCurrency: boolean;

  // Enterprise features
  hasWhiteLabel: boolean;
  hasDedicatedSupport: boolean;
  hasSLA: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: {
    monthly: number; // in CHF
    yearly: number; // in CHF
  };
  limits: PlanLimits;
  features: PlanFeatures;
  popular?: boolean;
}

export interface UsageStats {
  productsCount: number;
  ordersThisMonth: number;
  customersCount: number;
  usersCount: number;
}
