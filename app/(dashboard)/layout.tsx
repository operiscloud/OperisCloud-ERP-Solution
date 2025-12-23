import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

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
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        tenant={user.tenant}
        enabledModules={user.tenant.enabledModules}
        plan={user.tenant.plan}
      />
      <div className="lg:pl-64">
        <DashboardHeader user={user} tenant={user.tenant} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
