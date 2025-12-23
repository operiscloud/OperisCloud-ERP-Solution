import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CompanySettingsForm from '@/components/settings/CompanySettingsForm';
import { Building2 } from 'lucide-react';

export default async function CompanySettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { tenant: true },
  });

  if (!user) redirect('/onboarding');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Informations de l'entreprise</h1>
        <p className="text-gray-600">
          Ces informations apparaîtront sur vos factures et devis
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Building2 className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Coordonnées de l'entreprise
          </h2>
        </div>

        <CompanySettingsForm tenant={user.tenant} />
      </div>
    </div>
  );
}
