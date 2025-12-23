'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { Gift, Check } from 'lucide-react';
import Link from 'next/link';

export default function GiftCardsPageClient({ children }: { children: React.ReactNode }) {
  const { hasAccess: hasGiftCards } = usePlanFeature('hasGiftCards');

  if (!hasGiftCards) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-12 text-center">
          <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-purple-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bons cadeaux
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Créez et gérez des bons cadeaux pour vos clients. Fidélisez votre clientèle et augmentez vos ventes.
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités des bons cadeaux:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Création de codes personnalisés
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Gestion des soldes et expiration
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Historique des utilisations
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Activation/désactivation facile
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
