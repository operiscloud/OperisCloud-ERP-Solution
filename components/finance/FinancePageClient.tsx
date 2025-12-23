'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { DollarSign, Check } from 'lucide-react';
import Link from 'next/link';

export default function FinancePageClient({ children }: { children: React.ReactNode }) {
  const { hasAccess: hasFinance } = usePlanFeature('hasFinanceModule');

  if (!hasFinance) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-12 text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <DollarSign className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Module Finance
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Suivez vos dépenses, revenus et profitabilité. Gérez votre trésorerie et prenez de meilleures décisions financières.
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités Finance:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Suivi des dépenses et revenus
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Calcul automatique de la profitabilité
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Catégorisation des dépenses
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Rapports financiers détaillés
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Débloquer avec Pro - 29 CHF/mois
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            Essai gratuit 14 jours • Aucune carte requise
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
