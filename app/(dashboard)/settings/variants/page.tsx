import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPlan } from '@/lib/plans';
import VariantsSettingsClient from '@/components/settings/VariantsSettingsClient';

export default async function VariantsSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { plan: true } } },
  });

  if (!user) redirect('/onboarding');

  // Check plan access server-side
  const plan = getPlan(user.tenant.plan);
  const hasAccess = plan.features.hasVariants;

  return <VariantsSettingsClient hasAccess={hasAccess} />;
}
