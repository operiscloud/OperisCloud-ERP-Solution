import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PricingClient from '@/components/pricing/PricingClient';

export default async function PricingPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { tenant: true },
  });

  if (!user || !user.tenant) {
    redirect('/sign-in');
  }

  return <PricingClient currentPlan={user.tenant.plan} />;
}
