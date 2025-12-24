import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { DashboardLayoutClient } from '@/components/layout/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user and tenant
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          logo: true,
          plan: true,
          enabledModules: true,
          currency: true,
        },
      },
    },
  });

  if (!user || !user.tenant) {
    redirect('/onboarding');
  }

  return (
    <DashboardLayoutClient user={user} tenant={user.tenant}>
      {children}
    </DashboardLayoutClient>
  );
}
