'use client';

import { useState } from 'react';
import { Plus, Lock } from 'lucide-react';
import Link from 'next/link';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';

export default function NewCustomerButton() {
  const { canCreate, requiresUpgrade, plan } = usePlanLimit('customers');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (requiresUpgrade) {
      e.preventDefault();
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <Link
        href={canCreate ? "/crm/new" : "#"}
        onClick={handleClick}
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
          canCreate
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {canCreate ? (
          <Plus className="h-5 w-5 mr-2" />
        ) : (
          <Lock className="h-5 w-5 mr-2" />
        )}
        {canCreate ? 'Nouveau client' : 'Limite atteinte'}
      </Link>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Clients illimités"
        featureDescription="Vous avez atteint la limite de 25 clients du plan gratuit. Passez à Pro pour gérer un nombre illimité de clients."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </>
  );
}
