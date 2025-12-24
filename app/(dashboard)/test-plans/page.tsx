'use client';

import { useEffect, useState } from 'react';
import { usePlanLimit, usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { PLANS } from '@/lib/plans';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestPlansPage() {
  const [currentPlan, setCurrentPlan] = useState<string>('');
  const [usage, setUsage] = useState<any>(null);

  const {
    canCreate: canCreateProducts,
    currentUsage: productsCount,
    limit: productsLimit,
    loading: loadingProducts
  } = usePlanLimit('products');

  const {
    canCreate: canCreateOrders,
    currentUsage: ordersCount,
    limit: ordersLimit,
    loading: loadingOrders
  } = usePlanLimit('orders');

  const { hasAccess: hasVariants, loading: loadingVariants } = usePlanFeature('hasVariants');
  const { hasAccess: hasGiftCards, loading: loadingGiftCards } = usePlanFeature('hasGiftCards');
  const { hasAccess: hasPdf, loading: loadingPdf } = usePlanFeature('hasPdfGeneration');
  const { hasAccess: hasImport, loading: loadingImport } = usePlanFeature('hasImportExcel');
  const { hasAccess: hasAdvancedAnalytics, loading: loadingAnalytics } = usePlanFeature('hasAdvancedAnalytics');

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/plan/usage');
      const data = await response.json();
      setCurrentPlan(data.plan);
      setUsage(data.usage);
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const loading = loadingProducts || loadingOrders || loadingVariants;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const plan = PLANS[currentPlan as keyof typeof PLANS];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Test du Système de Plans</h1>
        <p className="text-blue-100">
          Changez votre plan dans Prisma Studio et rafraîchissez cette page pour voir les changements
        </p>
      </div>

      {/* Plan actuel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Plan Actuel</h2>
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-lg font-bold text-2xl">
            {currentPlan}
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold">{plan?.name}</div>
            <div className="text-gray-600">{plan?.description}</div>
            <div className="text-sm text-gray-500 mt-1">
              Prix: {plan?.price.monthly === 0 ? 'Gratuit' : `${plan?.price.monthly} CHF/mois`}
            </div>
          </div>
        </div>
      </div>

      {/* Utilisation actuelle */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Utilisation Actuelle</h2>
        <div className="grid grid-cols-2 gap-4">
          <UsageCard
            label="Produits"
            current={productsCount}
            limit={productsLimit}
            canCreate={canCreateProducts}
          />
          <UsageCard
            label="Commandes ce mois"
            current={ordersCount}
            limit={ordersLimit}
            canCreate={canCreateOrders}
          />
          <UsageCard
            label="Clients"
            current={usage?.customersCount || 0}
            limit={plan?.limits.maxCustomers || 0}
            canCreate={true}
          />
          <UsageCard
            label="Utilisateurs"
            current={usage?.usersCount || 0}
            limit={plan?.limits.maxUsers || 0}
            canCreate={true}
          />
        </div>
      </div>

      {/* Features disponibles */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Fonctionnalités Disponibles</h2>
        <div className="grid grid-cols-2 gap-3">
          <FeatureItem label="Dashboard basique" available={true} />
          <FeatureItem label="Gestion produits" available={true} />
          <FeatureItem label="Gestion commandes" available={true} />
          <FeatureItem label="Gestion clients" available={true} />

          <div className="col-span-2 border-t border-gray-200 my-2"></div>
          <div className="col-span-2 text-sm font-semibold text-gray-500">
            Fonctionnalités PRO
          </div>

          <FeatureItem label="Variantes de produits" available={hasVariants} />
          <FeatureItem label="Cartes cadeaux" available={hasGiftCards} />
          <FeatureItem label="Génération PDF" available={hasPdf} />
          <FeatureItem label="Import Excel" available={hasImport} />
          <FeatureItem label="Analytiques avancées" available={hasAdvancedAnalytics} />
          <FeatureItem label="Alertes stock bas" available={hasAdvancedAnalytics} />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold text-yellow-900 mb-2">📝 Comment tester</h3>
        <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
          <li>Ouvrez Prisma Studio: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma studio</code></li>
          <li>Cliquez sur le modèle "Tenant"</li>
          <li>Modifiez le champ "plan" vers: FREE, PRO, ou BUSINESS</li>
          <li>Sauvegardez</li>
          <li>Rafraîchissez cette page (F5)</li>
          <li>Observez les changements!</li>
        </ol>
      </div>

      {/* Légende des plans */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="font-bold text-gray-900 mb-2">FREE</div>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ 50 produits</li>
            <li>✓ 30 commandes/mois</li>
            <li>✓ 1 utilisateur</li>
            <li>✗ Pas de variantes</li>
            <li>✗ Pas de PDF</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
          <div className="font-bold text-blue-900 mb-2">PRO (29 CHF/mois)</div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✓ 500 produits</li>
            <li>✓ 200 commandes/mois</li>
            <li>✓ 3 utilisateurs</li>
            <li>✓ Variantes</li>
            <li>✓ PDF, Import, etc.</li>
          </ul>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300">
          <div className="font-bold text-indigo-900 mb-2">BUSINESS (69 CHF/mois)</div>
          <ul className="text-xs text-indigo-700 space-y-1">
            <li>✓ Tout illimité</li>
            <li>✓ 10 utilisateurs</li>
            <li>✓ API Access</li>
            <li>✓ Rôles & Permissions</li>
            <li>✓ Segmentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function UsageCard({
  label,
  current,
  limit,
  canCreate
}: {
  label: string;
  current: number;
  limit: number;
  canCreate: boolean;
}) {
  const percentage = limit === 0 ? 0 : (current / limit) * 100;
  const isNearLimit = percentage >= 80 && limit > 0;
  const isAtLimit = !canCreate && limit > 0;

  return (
    <div className={`border-2 rounded-lg p-4 ${
      isAtLimit ? 'border-red-300 bg-red-50' :
      isNearLimit ? 'border-orange-300 bg-orange-50' :
      'border-gray-200 bg-gray-50'
    }`}>
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {current} / {limit === 0 ? '∞' : limit}
      </div>
      {limit > 0 && (
        <div className="w-full bg-white rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              isAtLimit ? 'bg-red-600' :
              isNearLimit ? 'bg-orange-600' :
              'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      )}
      {limit === 0 && (
        <div className="text-xs text-gray-500">Illimité</div>
      )}
    </div>
  );
}

function FeatureItem({ label, available }: { label: string; available: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {available ? (
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
      )}
      <span className={`text-sm ${available ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
