import { getUserTenantPlan } from './tenant';

export type PlanFeature =
  | 'hasVariants'
  | 'hasPdfGeneration'
  | 'hasImportExcel'
  | 'hasApiAccess'
  | 'hasAdvancedReports'
  | 'hasInvoiceReminders'
  | 'hasBarcodeScanner';

interface PlanLimits {
  maxUsers: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  hasVariants: boolean;
  hasPdfGeneration: boolean;
  hasImportExcel: boolean;
  hasApiAccess: boolean;
  hasAdvancedReports: boolean;
  hasInvoiceReminders: boolean;
  hasBarcodeScanner: boolean;
}

const PLAN_FEATURES: Record<'FREE' | 'PRO' | 'BUSINESS', PlanLimits> = {
  FREE: {
    maxUsers: 1,
    maxProducts: 50,
    maxOrdersPerMonth: 100,
    hasVariants: false,
    hasPdfGeneration: false,
    hasImportExcel: false,
    hasApiAccess: false,
    hasAdvancedReports: false,
    hasInvoiceReminders: false,
    hasBarcodeScanner: false,
  },
  PRO: {
    maxUsers: 3,
    maxProducts: -1, // unlimited
    maxOrdersPerMonth: -1,
    hasVariants: true,
    hasPdfGeneration: true,
    hasImportExcel: true,
    hasApiAccess: false,
    hasAdvancedReports: true,
    hasInvoiceReminders: true,
    hasBarcodeScanner: true,
  },
  BUSINESS: {
    maxUsers: -1, // unlimited
    maxProducts: -1,
    maxOrdersPerMonth: -1,
    hasVariants: true,
    hasPdfGeneration: true,
    hasImportExcel: true,
    hasApiAccess: true,
    hasAdvancedReports: true,
    hasInvoiceReminders: true,
    hasBarcodeScanner: true,
  },
};

/**
 * Check if user has access to a feature (server-side)
 */
export async function hasFeatureAccess(feature: PlanFeature): Promise<boolean> {
  const plan = await getUserTenantPlan();
  if (!plan) return false;

  return PLAN_FEATURES[plan][feature];
}

/**
 * Get plan limits for current user (server-side)
 */
export async function getPlanLimits(): Promise<PlanLimits | null> {
  const plan = await getUserTenantPlan();
  if (!plan) return null;

  return PLAN_FEATURES[plan];
}

/**
 * Check if a specific tenant has access to a feature
 */
export async function checkFeatureAccess(tenantId: string, feature: PlanFeature): Promise<boolean> {
  const { prisma } = await import('./prisma');

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) return false;

  const plan = tenant.plan || 'FREE';
  return PLAN_FEATURES[plan][feature];
}
