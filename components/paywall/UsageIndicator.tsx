'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from './UpgradeModal';

interface UsageIndicatorProps {
  limitType: 'products' | 'orders' | 'customers' | 'users';
  label?: string;
  showModal?: boolean;
}

export default function UsageIndicator({
  limitType,
  label,
  showModal = true,
}: UsageIndicatorProps) {
  const { currentUsage, limit, percentage, isNearLimit, requiresUpgrade, plan, loading } =
    usePlanLimit(limitType);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
    );
  }

  // Don't show if unlimited (limit = 0)
  if (limit === 0) {
    return null;
  }

  const getLabel = () => {
    if (label) return label;
    switch (limitType) {
      case 'products':
        return 'Produits';
      case 'orders':
        return 'Commandes ce mois';
      case 'customers':
        return 'Clients';
      case 'users':
        return 'Utilisateurs';
    }
  };

  const getColor = () => {
    if (requiresUpgrade) return 'red';
    if (isNearLimit) return 'orange';
    return 'blue';
  };

  const color = getColor();

  const colorClasses = {
    red: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      bar: 'bg-red-600',
      border: 'border-red-300',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      bar: 'bg-orange-600',
      border: 'border-orange-300',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      bar: 'bg-blue-600',
      border: 'border-blue-300',
    },
  };

  const classes = colorClasses[color];

  return (
    <>
      <div
        className={`border ${classes.border} ${classes.bg} rounded-lg p-3 ${
          requiresUpgrade ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
        }`}
        onClick={() => {
          if (requiresUpgrade && showModal) {
            setIsModalOpen(true);
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{getLabel()}</span>
          {(isNearLimit || requiresUpgrade) && (
            <AlertTriangle className={`h-4 w-4 ${classes.text}`} />
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${classes.bar} transition-all duration-300`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <span className={`text-xs font-semibold ${classes.text} whitespace-nowrap`}>
            {currentUsage}/{limit}
          </span>
        </div>

        {requiresUpgrade && showModal && (
          <div className="mt-2">
            <button
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Passer à PRO pour plus →
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <UpgradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          feature={getLabel()}
          featureDescription={`Vous avez atteint la limite de ${limit} ${getLabel().toLowerCase()} de votre plan gratuit.`}
          currentPlan={plan}
          suggestedPlan="PRO"
        />
      )}
    </>
  );
}
