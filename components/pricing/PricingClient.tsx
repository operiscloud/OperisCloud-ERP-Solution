'use client';

import { useState } from 'react';
import { Check, X, Zap, Users, TrendingUp, Loader2 } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { PlanType } from '@/lib/types/plans';

interface PricingClientProps {
  currentPlan: PlanType;
}

export default function PricingClient({ currentPlan }: PricingClientProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<PlanType | null>(null);

  const plans: PlanType[] = ['FREE', 'PRO', 'BUSINESS'];

  const handleSelectPlan = async (planId: PlanType) => {
    if (planId === 'FREE') {
      return; // Don't handle FREE plan via Stripe
    }

    setLoading(planId);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billingCycle }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement');
        setLoading(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création de la session de paiement');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choisissez le plan parfait pour votre entreprise
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Commencez gratuitement, passez à la vitesse supérieure quand vous êtes prêt
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annuel
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((planId) => {
          const plan = PLANS[planId];
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const displayPrice =
            billingCycle === 'yearly' && price > 0 ? Math.round(price / 12) : price;
          const isCurrentPlan = planId === currentPlan;

          return (
            <div
              key={planId}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-xl relative'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">
                    {displayPrice === 0 ? 'Gratuit' : `${displayPrice}`}
                  </span>
                  {displayPrice > 0 && (
                    <span className="text-gray-600 ml-2">
                      CHF/{billingCycle === 'monthly' ? 'mois' : 'mois'}
                    </span>
                  )}
                </div>
                {billingCycle === 'yearly' && price > 0 && (
                  <p className="text-sm text-gray-600 mt-1">Facturé {price} CHF/an</p>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(planId)}
                disabled={loading !== null || isCurrentPlan}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrentPlan
                    ? 'bg-green-100 text-green-700 border-2 border-green-600'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {loading === planId ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Chargement...
                  </>
                ) : isCurrentPlan ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Plan actuel
                  </>
                ) : (
                  'Choisir ce plan'
                )}
              </button>

              {/* Features */}
              <div className="space-y-4">
                <div className="font-semibold text-gray-900 mb-3">Inclus:</div>

                {/* Limits */}
                <Feature
                  included={true}
                  text={
                    plan.limits.maxProducts === 0
                      ? 'Produits illimités'
                      : `${plan.limits.maxProducts} produits`
                  }
                />
                <Feature
                  included={true}
                  text={
                    plan.limits.maxOrdersPerMonth === 0
                      ? 'Commandes illimitées'
                      : `${plan.limits.maxOrdersPerMonth} commandes/mois`
                  }
                />
                <Feature
                  included={true}
                  text={
                    plan.limits.maxUsers === 0
                      ? 'Utilisateurs illimités'
                      : plan.limits.maxUsers === 1
                      ? '1 utilisateur'
                      : `${plan.limits.maxUsers} utilisateurs`
                  }
                />
                <Feature
                  included={true}
                  text={
                    plan.limits.dataRetentionDays === 0
                      ? 'Historique illimité'
                      : `Historique ${plan.limits.dataRetentionDays} jours`
                  }
                />

                <div className="border-t border-gray-200 my-4"></div>

                {/* Key Features */}
                <Feature
                  included={plan.features.hasVariants}
                  text="Variantes de produits"
                />
                <Feature
                  included={plan.features.hasGiftCards}
                  text="Cartes cadeaux"
                />
                <Feature
                  included={plan.features.hasFinanceModule}
                  text="Module Finance"
                />
                <Feature
                  included={plan.features.hasPdfGeneration}
                  text="Génération PDF"
                />
                <Feature
                  included={plan.features.hasImportExcel}
                  text="Import Excel"
                />
                <Feature
                  included={plan.features.hasAdvancedAnalytics}
                  text="Analytiques avancées"
                />
                <Feature
                  included={plan.features.hasInvoiceReminders}
                  text="Rappels de paiement automatiques"
                />
                <Feature
                  included={plan.features.hasBarcodeScanner}
                  text="Scanner de code-barres mobile"
                />

                {planId === 'BUSINESS' && (
                  <>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="text-sm font-semibold text-blue-600 mb-2">
                      Fonctionnalités avancées:
                    </div>
                    <Feature
                      included={plan.features.hasAdvancedSegmentation}
                      text="Segmentation clients"
                    />
                    <Feature
                      included={plan.features.hasRolesPermissions}
                      text="Rôles & Permissions"
                    />
                    <Feature
                      included={plan.features.hasApiAccess}
                      text="API Access"
                    />
                    <Feature
                      included={plan.features.hasCustomFields}
                      text="Champs personnalisés"
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-white text-center">
        <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Besoin de plus ?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Notre plan Enterprise offre des fonctionnalités sur mesure, un support dédié 24/7, et une
          infrastructure adaptée aux grandes entreprises.
        </p>
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Utilisateurs illimités</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>SLA garanti 99.9%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            <span>White-label</span>
          </div>
        </div>
        <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Contactez-nous
        </button>
      </div>

      {/* FAQ or Trust section */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Essai gratuit 14 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Aucune carte bancaire requise</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Annulation à tout moment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ included, text }: { included: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-400'}`}>{text}</span>
    </div>
  );
}
