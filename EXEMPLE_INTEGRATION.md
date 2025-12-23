# Exemples d'Intégration du Système de Plans

## 1. Bloquer la création de produits à la limite

### Dans `/app/(dashboard)/inventory/page.tsx`

Modifiez le bouton "Nouveau produit" pour vérifier la limite:

```tsx
'use client';

import { useState } from 'react';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function InventoryPageClient() {
  const { canCreate, requiresUpgrade, plan, loading } = usePlanLimit('products');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleNewProduct = (e: React.MouseEvent) => {
    if (requiresUpgrade) {
      e.preventDefault();
      setShowUpgrade(true);
    }
    // Sinon, le Link fonctionnera normalement
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventaire</h1>

        {loading ? (
          <div className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg"></div>
        ) : (
          <Link
            href={canCreate ? "/inventory/new" : "#"}
            onClick={handleNewProduct}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              canCreate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Plus className="h-5 w-5" />
            Nouveau produit
          </Link>
        )}
      </div>

      {/* Afficher l'utilisation */}
      <UsageIndicator limitType="products" />

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Produits illimités"
        featureDescription="Vous avez atteint la limite de 50 produits du plan gratuit."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </>
  );
}
```

---

## 2. Bloquer les Variantes de Produits (Feature Premium)

### Dans `/app/(dashboard)/inventory/[id]/page.tsx` ou `/inventory/new/page.tsx`

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { Lock } from 'lucide-react';

export default function ProductForm() {
  const { hasAccess: hasVariants, plan } = usePlanFeature('hasVariants');
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <form>
      {/* Champs normaux du produit */}
      <input name="name" placeholder="Nom du produit" />
      <input name="price" placeholder="Prix" />

      {/* Section Variantes - Bloquée pour FREE */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Variantes du produit</h3>
          {!hasVariants && (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
              PRO
            </span>
          )}
        </div>

        {hasVariants ? (
          <div>
            {/* Interface de gestion des variantes */}
            <button type="button" className="text-blue-600">
              + Ajouter une variante (taille, couleur, etc.)
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Overlay avec effet blur */}
            <div className="filter blur-sm pointer-events-none select-none">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex gap-2 mb-2">
                  <input placeholder="Nom" className="flex-1 px-3 py-2 border rounded" disabled />
                  <input placeholder="SKU" className="flex-1 px-3 py-2 border rounded" disabled />
                  <input placeholder="Prix" className="w-24 px-3 py-2 border rounded" disabled />
                </div>
              </div>
            </div>

            {/* Message de déblocage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white border-2 border-blue-600 rounded-xl p-6 text-center shadow-xl max-w-md">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Variantes de produits
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Gérez plusieurs versions d'un produit avec différentes tailles, couleurs, ou autres attributs.
                  Chaque variante a son propre stock et prix.
                </p>
                <button
                  type="button"
                  onClick={() => setShowUpgrade(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Débloquer avec Pro - 29 CHF/mois
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Variantes de produits"
        featureDescription="Les variantes vous permettent de gérer plusieurs versions d'un produit (tailles, couleurs, formats, etc.) avec leur propre stock et prix."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </form>
  );
}
```

---

## 3. Bloquer la Génération de PDF (Factures)

### Dans `/app/(dashboard)/sales/[id]/page.tsx`

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { FileText, Download } from 'lucide-react';

export default function OrderDetailPage({ order }) {
  const { hasAccess: hasPdf, plan } = usePlanFeature('hasPdfGeneration');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleDownloadPdf = () => {
    if (!hasPdf) {
      setShowUpgrade(true);
      return;
    }
    // Télécharger le PDF
    window.open(`/api/orders/${order.id}/pdf`, '_blank');
  };

  return (
    <div>
      <h1>Commande #{order.orderNumber}</h1>

      {/* Bouton de téléchargement PDF */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleDownloadPdf}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            hasPdf
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-600 border-2 border-dashed border-gray-300'
          }`}
        >
          <FileText className="h-5 w-5" />
          Télécharger PDF
          {!hasPdf && <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">PRO</span>}
        </button>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Génération de PDF"
        featureDescription="Générez des factures et devis professionnels en PDF à envoyer à vos clients."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </div>
  );
}
```

---

## 4. Bloquer l'Import Excel

### Dans `/app/(dashboard)/settings/import/page.tsx`

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import { Upload, Lock } from 'lucide-react';

export default function ImportPage() {
  const { hasAccess: hasImport, plan } = usePlanFeature('hasImportExcel');

  if (!hasImport) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Import Excel
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Importez vos produits, clients et commandes en masse depuis Excel.
            Gagnez des heures de saisie manuelle.
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Ce que vous pouvez importer:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Produits avec variantes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Clients avec historique
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Commandes complètes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Templates Excel pré-formatés
              </li>
            </ul>
          </div>

          <a
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Débloquer avec Pro - 29 CHF/mois
          </a>

          <p className="text-sm text-gray-600 mt-4">
            Essai gratuit 14 jours • Aucune carte requise
          </p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a accès, afficher la page normale
  return (
    <div>
      <h1>Import Excel</h1>
      {/* Interface d'import normale */}
    </div>
  );
}
```

---

## 5. Afficher les Analytiques Limitées (Gratuit = 7 jours seulement)

### Dans `/app/(dashboard)/analytics/page.tsx`

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';

export default function AnalyticsPage() {
  const { hasAccess: hasAdvanced } = usePlanFeature('hasAdvancedAnalytics');

  // Pour le plan gratuit, bloquer certains filtres
  const availableFilters = hasAdvanced
    ? ['7days', '30days', '3months', '1year', 'all', 'custom']
    : ['7days']; // GRATUIT = seulement 7 jours

  return (
    <div>
      <h1>Analytiques</h1>

      {!hasAdvanced && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            📊 Avec le plan gratuit, vous voyez les 7 derniers jours.
            <a href="/pricing" className="font-semibold text-yellow-900 underline ml-1">
              Passez à Pro pour voir jusqu'à 1 an d'historique
            </a>
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {availableFilters.map(filter => (
          <button key={filter} className="px-4 py-2 rounded-lg border">
            {filter}
          </button>
        ))}

        {/* Afficher les filtres bloqués avec effet blur */}
        {!hasAdvanced && (
          <>
            <button disabled className="px-4 py-2 rounded-lg border bg-gray-100 text-gray-400 relative">
              30 derniers jours
              <Lock className="h-3 w-3 absolute top-1 right-1" />
            </button>
            <button disabled className="px-4 py-2 rounded-lg border bg-gray-100 text-gray-400 relative">
              3 derniers mois
              <Lock className="h-3 w-3 absolute top-1 right-1" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Protection Côté Serveur (CRITIQUE!)

### Dans `/app/api/products/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { isWithinLimit, getPlan } from '@/lib/plans';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    // VÉRIFICATION DU PLAN - IMPORTANT!
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { plan: true },
    });

    const currentPlan = tenant?.plan || 'FREE';

    // Compter les produits existants
    const productsCount = await prisma.product.count({
      where: { tenantId, isActive: true },
    });

    // Vérifier si la limite est atteinte
    if (!isWithinLimit(currentPlan, 'maxProducts', productsCount)) {
      const planData = getPlan(currentPlan);
      return NextResponse.json(
        {
          error: `Limite de ${planData.limits.maxProducts} produits atteinte`,
          code: 'PLAN_LIMIT_REACHED',
          suggestedPlan: 'PRO',
        },
        { status: 403 }
      );
    }

    // Continuer avec la création du produit
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        ...body,
        tenantId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
```

---

## 7. Gestion des Erreurs de Limite Côté Client

```tsx
'use client';

const handleCreateProduct = async (data: ProductData) => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.status === 403) {
      const error = await response.json();
      if (error.code === 'PLAN_LIMIT_REACHED') {
        setShowUpgradeModal(true);
        toast.error(error.error);
        return;
      }
    }

    if (!response.ok) throw new Error('Erreur');

    const product = await response.json();
    toast.success('Produit créé!');
    router.push('/inventory');
  } catch (error) {
    toast.error('Erreur lors de la création');
  }
};
```

---

## 📌 Checklist d'Intégration

Pour chaque fonctionnalité premium, assurez-vous de:

- [ ] Vérifier côté client avec `usePlanFeature` ou `usePlanLimit`
- [ ] Afficher un paywall visuel quand bloqué
- [ ] Vérifier côté serveur dans l'API route
- [ ] Retourner un code d'erreur 403 avec `PLAN_LIMIT_REACHED`
- [ ] Gérer l'erreur côté client et afficher le modal d'upgrade
- [ ] Tester avec différents plans (FREE, PRO, BUSINESS)

Bonne intégration! 🚀
