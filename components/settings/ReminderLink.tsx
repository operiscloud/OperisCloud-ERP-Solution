'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import UpgradeModal from '@/components/paywall/UpgradeModal';
import { PlanType } from '@/lib/types/plans';

interface ReminderLinkProps {
  hasAccess: boolean;
  currentPlan: PlanType;
}

export default function ReminderLink({ hasAccess, currentPlan }: ReminderLinkProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (hasAccess) {
    return (
      <a
        href="/settings/reminders"
        className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Bell className="h-5 w-5 text-blue-600" />
        <div>
          <div className="font-medium text-gray-900">Rappels automatiques</div>
          <div className="text-sm text-gray-500">Factures impayées</div>
        </div>
      </a>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
      >
        <Bell className="h-5 w-5 text-gray-400" />
        <div>
          <div className="font-medium text-gray-600 flex items-center gap-2">
            Rappels automatiques
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">PRO</span>
          </div>
          <div className="text-sm text-gray-500">Factures impayées</div>
        </div>
      </button>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Rappels automatiques de factures"
        featureDescription="Envoyez automatiquement des rappels par email pour les factures impayées. Configurez les intervalles et personnalisez les messages pour améliorer vos recouvrements."
        currentPlan={currentPlan}
        suggestedPlan="PRO"
      />
    </>
  );
}
