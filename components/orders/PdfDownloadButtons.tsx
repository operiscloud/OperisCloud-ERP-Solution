'use client';

import { useState } from 'react';
import { Download, FileText, Lock } from 'lucide-react';
import UpgradeModal from '@/components/paywall/UpgradeModal';

interface PdfDownloadButtonsProps {
  orderId: string;
  orderNumber: string;
  hasPdfAccess: boolean;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
}

export default function PdfDownloadButtons({ orderId, orderNumber, hasPdfAccess, plan }: PdfDownloadButtonsProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handlePdfClick = (e: React.MouseEvent, type: 'invoice' | 'quote') => {
    if (!hasPdfAccess) {
      e.preventDefault();
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <a
          href={hasPdfAccess ? `/api/orders/${orderId}/invoice` : '#'}
          onClick={(e) => handlePdfClick(e, 'invoice')}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
            hasPdfAccess
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300 cursor-not-allowed'
          }`}
          download={hasPdfAccess}
        >
          {hasPdfAccess ? (
            <Download className="h-4 w-4 mr-2" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          Facture PDF
          {!hasPdfAccess && (
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">PRO</span>
          )}
        </a>
        <a
          href={hasPdfAccess ? `/api/orders/${orderId}/quote` : '#'}
          onClick={(e) => handlePdfClick(e, 'quote')}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
            hasPdfAccess
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300 cursor-not-allowed'
          }`}
          download={hasPdfAccess}
        >
          {hasPdfAccess ? (
            <FileText className="h-4 w-4 mr-2" />
          ) : (
            <Lock className="h-4 w-4 mr-2" />
          )}
          Devis PDF
          {!hasPdfAccess && (
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">PRO</span>
          )}
        </a>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Génération de PDF"
        featureDescription="Générez des factures et devis professionnels en PDF à envoyer à vos clients. Personnalisez vos documents avec votre logo et vos informations."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </>
  );
}
