'use client';

import { useState } from 'react';
import { CreditCard, Loader2, Calendar, CheckCircle2 } from 'lucide-react';
import { Plan } from '@prisma/client';

interface SubscriptionManagementProps {
  currentPlan: Plan;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeCurrentPeriodEnd: Date | null;
}

export default function SubscriptionManagement({
  currentPlan,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeCurrentPeriodEnd,
}: SubscriptionManagementProps) {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la création de la session portail');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la création de la session portail');
      setLoading(false);
    }
  };

  // If FREE plan and no Stripe customer, show nothing
  if (currentPlan === 'FREE' && !stripeCustomerId) {
    return null;
  }

  // Format the renewal date
  const renewalDate = stripeCurrentPeriodEnd
    ? new Date(stripeCurrentPeriodEnd).toLocaleDateString('fr-CH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Gestion de l'abonnement
      </h2>

      <div className="space-y-3">
        {/* Current Plan Status */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                Plan {currentPlan}
              </span>
            </div>
            {renewalDate && (
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Renouvellement le {renewalDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Manage Subscription Button */}
        {stripeCustomerId && (
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Chargement...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Gérer mon abonnement
              </>
            )}
          </button>
        )}

        <p className="text-sm text-gray-500">
          Gérez votre moyen de paiement, consultez vos factures, ou annulez votre abonnement dans le portail de facturation sécurisé.
        </p>
      </div>
    </div>
  );
}
