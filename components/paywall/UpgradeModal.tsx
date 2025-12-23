'use client';

import { X, Check, Zap } from 'lucide-react';
import { PlanType } from '@/lib/types/plans';
import { PLANS } from '@/lib/plans';
import Link from 'next/link';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  featureDescription?: string;
  currentPlan: PlanType;
  suggestedPlan?: PlanType;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  feature,
  featureDescription,
  currentPlan,
  suggestedPlan = 'PRO',
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const plan = PLANS[suggestedPlan];
  const current = PLANS[currentPlan];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Passez à {plan.name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Feature blocked message */}
        {feature && (
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">
              {feature} est une fonctionnalité {plan.name}
            </h3>
            {featureDescription && (
              <p className="text-gray-700">{featureDescription}</p>
            )}
          </div>
        )}

        {/* Plan comparison */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Current plan */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Votre plan actuel</div>
              <div className="text-xl font-bold text-gray-900">{current.name}</div>
              <div className="text-2xl font-bold text-gray-400 mt-2">
                {current.price.monthly === 0 ? (
                  'Gratuit'
                ) : (
                  <>{current.price.monthly} CHF/mois</>
                )}
              </div>
            </div>

            {/* Suggested plan */}
            <div className="border-2 border-blue-600 rounded-lg p-4 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recommandé
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Passez à</div>
              <div className="text-xl font-bold text-blue-600">{plan.name}</div>
              <div className="text-2xl font-bold text-gray-900 mt-2">
                {plan.price.monthly} CHF/mois
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ou {plan.price.yearly} CHF/an
              </div>
            </div>
          </div>

          {/* Features included */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Ce que vous débloquez avec {plan.name}:
            </h4>
            <div className="space-y-2">
              {plan.id === 'PRO' && (
                <>
                  <FeatureItem text="Variantes de produits (taille, couleur, etc.)" />
                  <FeatureItem text="Cartes cadeaux avec validation automatique" />
                  <FeatureItem text="Module Finance - Suivi des dépenses" />
                  <FeatureItem text="Analytiques avancées (tous les filtres)" />
                  <FeatureItem text="Génération PDF (devis & factures)" />
                  <FeatureItem text="PDF personnalisable (devis & factures)" />
                  <FeatureItem text="Import Excel (produits, clients, commandes)" />
                  <FeatureItem text="Alertes de stock bas automatiques" />
                  <FeatureItem text="Jusqu'à 500 produits & 200 commandes/mois" />
                  <FeatureItem text="3 utilisateurs inclus" />
                </>
              )}
              {plan.id === 'BUSINESS' && (
                <>
                  <FeatureItem text="Tout du plan Pro, PLUS:" isHighlight />
                  <FeatureItem text="Segmentation clients avancée (tags, cohortes)" />
                  <FeatureItem text="Rôles et permissions (5 niveaux)" />
                  <FeatureItem text="API Access & Webhooks" />
                  <FeatureItem text="Champs personnalisés" />
                  <FeatureItem text="Automatisations & notifications" />
                  <FeatureItem text="Multi-devises" />
                  <FeatureItem text="Produits, commandes, clients illimités" />
                  <FeatureItem text="10 utilisateurs inclus" />
                </>
              )}
            </div>
          </div>

          {/* Savings */}
          {plan.price.monthly > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="text-sm font-semibold text-green-900">
                Économisez avec le paiement annuel
              </div>
              <div className="text-sm text-green-700 mt-1">
                Payez annuellement et économisez{' '}
                {plan.price.monthly * 12 - plan.price.yearly} CHF (~2 mois gratuits)
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              onClick={onClose}
            >
              Voir tous les plans
            </Link>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Plus tard
            </button>
          </div>

          {/* 14-day trial note */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Essai gratuit de 14 jours • Aucune carte bancaire requise
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text, isHighlight = false }: { text: string; isHighlight?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <Check
        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
          isHighlight ? 'text-blue-600' : 'text-green-600'
        }`}
      />
      <span className={`text-sm ${isHighlight ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
        {text}
      </span>
    </div>
  );
}
