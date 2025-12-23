import { useEffect, useState } from 'react';
import { PlanType, UsageStats } from '@/lib/types/plans';
import { isWithinLimit, hasFeature, getPlan, getLimitPercentage } from '@/lib/plans';

interface PlanLimitResult {
  canCreate: boolean;
  isNearLimit: boolean; // true if > 80% of limit
  currentUsage: number;
  limit: number;
  percentage: number;
  requiresUpgrade: boolean;
  plan: PlanType;
}

export function usePlanLimit(limitType: 'products' | 'orders' | 'customers' | 'users') {
  const [result, setResult] = useState<PlanLimitResult>({
    canCreate: true,
    isNearLimit: false,
    currentUsage: 0,
    limit: 0,
    percentage: 0,
    requiresUpgrade: false,
    plan: 'FREE',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanLimit();
  }, [limitType]);

  const fetchPlanLimit = async () => {
    try {
      const response = await fetch('/api/plan/usage');
      if (!response.ok) throw new Error('Failed to fetch plan usage');

      const data = await response.json();
      const { plan, usage } = data as { plan: PlanType; usage: UsageStats };

      let currentUsage = 0;
      let limitKey: 'maxProducts' | 'maxOrdersPerMonth' | 'maxCustomers' | 'maxUsers' =
        'maxProducts';

      switch (limitType) {
        case 'products':
          currentUsage = usage.productsCount;
          limitKey = 'maxProducts';
          break;
        case 'orders':
          currentUsage = usage.ordersThisMonth;
          limitKey = 'maxOrdersPerMonth';
          break;
        case 'customers':
          currentUsage = usage.customersCount;
          limitKey = 'maxCustomers';
          break;
        case 'users':
          currentUsage = usage.usersCount;
          limitKey = 'maxUsers';
          break;
      }

      const planData = getPlan(plan);
      const limit = planData.limits[limitKey];
      const canCreate = isWithinLimit(plan, limitKey, currentUsage);
      const percentage = getLimitPercentage(plan, limitKey, currentUsage);
      const isNearLimit = percentage >= 80 && limit > 0;

      setResult({
        canCreate,
        isNearLimit,
        currentUsage,
        limit,
        percentage,
        requiresUpgrade: !canCreate,
        plan,
      });
    } catch (error) {
      console.error('Error fetching plan limit:', error);
    } finally {
      setLoading(false);
    }
  };

  return { ...result, loading, refresh: fetchPlanLimit };
}

// Hook to check if a feature is available
export function usePlanFeature(feature: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [plan, setPlan] = useState<PlanType>('FREE');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanFeature();
  }, [feature]);

  const fetchPlanFeature = async () => {
    try {
      const response = await fetch('/api/plan/usage');
      if (!response.ok) throw new Error('Failed to fetch plan usage');

      const data = await response.json();
      const currentPlan = data.plan as PlanType;
      setPlan(currentPlan);

      // Check if feature exists in plan
      const access = hasFeature(currentPlan, feature as any);
      setHasAccess(access);
    } catch (error) {
      console.error('Error fetching plan feature:', error);
    } finally {
      setLoading(false);
    }
  };

  return { hasAccess, plan, loading, refresh: fetchPlanFeature };
}
