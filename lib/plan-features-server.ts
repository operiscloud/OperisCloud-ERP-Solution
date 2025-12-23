import { getUserTenantPlan } from './tenant';

export type PlanFeature =
  | 'hasVariants'
  | 'hasPdfGeneration'
  | 'hasImportExcel'
  | 'hasApiAccess'
  | 'hasAdvancedReports';

interface PlanLimits {
  maxUsers: number;
  maxProducts: number;
  maxOrdersPerMonth: number;
  hasVariants: boolean;
  hasPdfGeneration: boolean;
  hasImportExcel: boolean;
  hasApiAccess: boolean;
  hasAdvancedReports: boolean;
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
