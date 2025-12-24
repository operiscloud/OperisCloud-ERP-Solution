'use client';

import { useState } from 'react';
import { Calendar, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Plan } from '@prisma/client';

export type PeriodOption = '7days' | '30days' | '3months' | '6months' | '12months' | 'all';

interface PeriodSelectorProps {
  selectedPeriod: PeriodOption;
  onPeriodChange: (period: PeriodOption) => void;
  plan: Plan;
}

const periods: { value: PeriodOption; label: string; proOnly: boolean }[] = [
  { value: '7days', label: '7 jours', proOnly: false },
  { value: '30days', label: '30 jours', proOnly: false },
  { value: '3months', label: '3 mois', proOnly: true },
  { value: '6months', label: '6 mois', proOnly: true },
  { value: '12months', label: '12 mois', proOnly: true },
  { value: 'all', label: 'Tout', proOnly: true },
];

export function PeriodSelector({ selectedPeriod, onPeriodChange, plan }: PeriodSelectorProps) {
  const hasProAccess = plan !== 'FREE';
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">Période:</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {periods.map((period) => {
          const isLocked = period.proOnly && !hasProAccess;
          const isSelected = selectedPeriod === period.value;

          if (isLocked) {
            return (
              <button
                key={period.value}
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {period.label}
                <Lock className="h-3 w-3" />
              </button>
            );
          }

          return (
            <button
              key={period.value}
              onClick={() => onPeriodChange(period.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {period.label}
            </button>
          );
        })}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowUpgradeModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center border-2 border-blue-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fonctionnalité PRO
            </h3>

            <p className="text-gray-600 mb-6">
              Accédez aux périodes étendues (3 mois, 6 mois, 12 mois et plus) pour analyser vos données sur le long terme et identifier les tendances de votre activité
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Passer à PRO
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>

              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Fermer
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              À partir de 29 CHF/mois
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
