import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ReminderSettingsForm from '@/components/settings/ReminderSettingsForm';
import { Bell } from 'lucide-react';
import { checkFeatureAccess } from '@/lib/plan-features-server';

export default async function ReminderSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      tenant: true,
    },
  });

  if (!user) redirect('/onboarding');

  // Check if user has access to invoice reminders
  const hasAccess = await checkFeatureAccess(user.tenant.id, 'hasInvoiceReminders');

  if (!hasAccess) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rappels automatiques</h1>
          <p className="text-gray-600">
            Envoyez des rappels automatiques pour les factures impayées
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Bell className="h-6 w-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Fonctionnalité Premium
              </h3>
              <p className="text-yellow-800 mb-4">
                Les rappels automatiques sont disponibles à partir du plan PRO.
                Passez à un plan supérieur pour activer cette fonctionnalité.
              </p>
              <a
                href="/settings/plan"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Voir les plans
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get existing reminder settings
  let settings = await prisma.reminderSettings.findUnique({
    where: { tenantId: user.tenant.id },
  });

  // Create default settings if they don't exist
  if (!settings) {
    settings = await prisma.reminderSettings.create({
      data: {
        tenantId: user.tenant.id,
        enabled: true,
        firstReminderDays: 7,
        secondReminderDays: 14,
        finalReminderDays: 30,
        sendToAdmin: true,
        sendToCustomer: true,
      },
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rappels automatiques</h1>
        <p className="text-gray-600">
          Configurez les rappels automatiques pour les factures impayées
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Configuration des rappels
          </h2>
        </div>

        <ReminderSettingsForm settings={settings} tenantEmail={user.tenant.companyEmail} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Comment ça fonctionne ?</h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Les rappels sont envoyés automatiquement pour les commandes avec une date d'échéance passée</li>
          <li>• Seules les commandes avec un statut de paiement "En attente" ou "Partiel" reçoivent des rappels</li>
          <li>• Vous pouvez configurer jusqu'à 3 rappels avec des intervalles personnalisés</li>
          <li>• Les emails peuvent être envoyés au client et/ou à l'administrateur</li>
          <li>• Un historique de tous les rappels envoyés est conservé</li>
        </ul>
      </div>
    </div>
  );
}
