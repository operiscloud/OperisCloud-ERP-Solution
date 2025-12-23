import { hasFeatureAccess, getPlanLimits } from '@/lib/plan-features-server';
import { getUserTenantPlan } from '@/lib/tenant';
import NewProductClient from './NewProductClient';

export default async function NewProductPage() {
  const hasVariantsAccess = await hasFeatureAccess('hasVariants');
  const plan = await getUserTenantPlan() || 'FREE';

  return <NewProductClient hasVariantsAccess={hasVariantsAccess} plan={plan} />;
}
