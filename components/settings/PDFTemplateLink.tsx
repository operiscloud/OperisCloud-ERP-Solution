'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import UpgradeModal from '@/components/paywall/UpgradeModal';
import { PlanType } from '@/lib/types/plans';

interface PDFTemplateLinkProps {
  hasAccess: boolean;
  currentPlan: PlanType;
}

export default function PDFTemplateLink({ hasAccess, currentPlan }: PDFTemplateLinkProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (hasAccess) {
    return (
      <a
        href="/settings/pdf-templates"
        className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <FileText className="h-5 w-5 text-blue-600" />
        <div>
          <div className="font-medium text-gray-900">Templates PDF</div>
          <div className="text-sm text-gray-500">Personnaliser factures et devis</div>
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
        <FileText className="h-5 w-5 text-gray-400" />
        <div>
          <div className="font-medium text-gray-600 flex items-center gap-2">
            Templates PDF
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">PRO</span>
          </div>
          <div className="text-sm text-gray-500">Personnaliser factures et devis</div>
        </div>
      </button>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Templates PDF personnalisés"
        featureDescription="Personnalisez vos factures et devis avec vos couleurs, polices et style de marque pour une image professionnelle."
        currentPlan={currentPlan}
        suggestedPlan="PRO"
      />
    </>
  );
}
