import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPlan, getLimitPercentage } from '@/lib/plans';
import CategoriesSettingsClient from '@/components/settings/CategoriesSettingsClient';

export default async function CategoriesSettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      tenantId: true,
      tenant: {
        select: {
          plan: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const categories = await prisma.category.findMany({
    where: { tenantId: user.tenantId },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  const plan = getPlan(user.tenant.plan);
  const categoriesCount = categories.length;
  const limitPercentage = getLimitPercentage(user.tenant.plan, 'maxCategories', categoriesCount);

  return (
    <CategoriesSettingsClient
      categories={categories}
      plan={plan}
      categoriesCount={categoriesCount}
      limitPercentage={limitPercentage}
    />
  );
}
