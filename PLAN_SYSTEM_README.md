# Système de Plans Tarifaires - Guide d'Utilisation

Ce document explique comment utiliser le système de plans tarifaires dans BusinessHub.

## 📁 Fichiers Créés

### Configuration
- `lib/types/plans.ts` - Types TypeScript pour les plans
- `lib/plans.ts` - Configuration des plans (FREE, PRO, BUSINESS, ENTERPRISE)

### API
- `app/api/plan/usage/route.ts` - Endpoint pour récupérer l'utilisation actuelle

### Hooks
- `lib/hooks/usePlanLimit.ts` - Hook pour vérifier les limites et features

### Composants
- `components/paywall/UpgradeModal.tsx` - Modal pour upgrader
- `components/paywall/UsageIndicator.tsx` - Indicateur d'utilisation avec barre de progression
- `components/dashboard/PlanUsageWidget.tsx` - Widget pour le dashboard

### Pages
- `app/(dashboard)/pricing/page.tsx` - Page de tarification complète

---

## 🚀 Comment Utiliser

### 1. Vérifier les Limites (dans une Page ou Composant)

```tsx
'use client';

import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import { useState } from 'react';
import UpgradeModal from '@/components/paywall/UpgradeModal';

export default function ProductsPage() {
  const { canCreate, requiresUpgrade, plan } = usePlanLimit('products');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleCreateProduct = () => {
    if (!canCreate) {
      setShowUpgrade(true);
      return;
    }
    // Continuer avec la création
  };

  return (
    <>
      <button onClick={handleCreateProduct}>
        Créer un produit
      </button>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Produits illimités"
        featureDescription="Vous avez atteint la limite de produits de votre plan gratuit."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </>
  );
}
```

### 2. Vérifier une Feature (Variantes, PDF, etc.)

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';

export default function ProductFormPage() {
  const { hasAccess, plan } = usePlanFeature('hasVariants');
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div>
      {hasAccess ? (
        <div>
          {/* Formulaire de variantes */}
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <h3 className="font-semibold mb-2">Variantes de produits</h3>
          <p className="text-sm text-gray-600 mb-4">
            Les variantes vous permettent de gérer plusieurs versions d'un produit (tailles, couleurs, etc.)
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Débloquer les variantes - Plan Pro
          </button>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Variantes de produits"
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </div>
  );
}
```

### 3. Afficher les Indicateurs d'Utilisation

```tsx
import UsageIndicator from '@/components/paywall/UsageIndicator';

export default function SettingsPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <UsageIndicator limitType="products" />
      <UsageIndicator limitType="orders" />
      <UsageIndicator limitType="customers" />
      <UsageIndicator limitType="users" />
    </div>
  );
}
```

### 4. Ajouter le Widget au Dashboard

Dans `app/(dashboard)/dashboard/page.tsx`, ajoutez:

```tsx
import PlanUsageWidget from '@/components/dashboard/PlanUsageWidget';

export default async function DashboardPage() {
  // ... votre code existant

  return (
    <div>
      {/* Vos composants existants */}

      {/* Nouveau widget d'utilisation */}
      <PlanUsageWidget />
    </div>
  );
}
```

---

## 🎨 Personnalisation

### Modifier les Limites d'un Plan

Éditez `lib/plans.ts`:

```typescript
PRO: {
  id: 'PRO',
  name: 'Pro',
  price: {
    monthly: 29,  // Changez le prix ici
    yearly: 290,
  },
  limits: {
    maxProducts: 500,  // Changez les limites ici
    maxOrdersPerMonth: 200,
    maxCustomers: 0,
    maxUsers: 3,
    dataRetentionDays: 365,
  },
  features: {
    hasVariants: true,  // Activez/désactivez les features ici
    hasGiftCards: true,
    // ...
  }
}
```

### Ajouter une Nouvelle Feature

1. Ajoutez la feature dans `lib/types/plans.ts`:
```typescript
export interface PlanFeatures {
  // ... features existantes
  hasMyNewFeature: boolean;
}
```

2. Configurez-la dans `lib/plans.ts` pour chaque plan

3. Utilisez-la dans votre code:
```typescript
const { hasAccess } = usePlanFeature('hasMyNewFeature');
```

---

## 🔒 Bloquer une Feature (Exemple: Variantes)

Dans votre page de création/édition de produit:

```tsx
'use client';

import { usePlanFeature } from '@/lib/hooks/usePlanLimit';

export default function ProductEditPage() {
  const { hasAccess: hasVariants, plan } = usePlanFeature('hasVariants');

  return (
    <div>
      {/* Champs normaux du produit */}

      {/* Section Variantes */}
      {hasVariants ? (
        <div>
          <h3>Variantes du produit</h3>
          {/* Interface de gestion des variantes */}
        </div>
      ) : (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            🔒 Variantes de produits - Plan Pro
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Gérez plusieurs versions de vos produits (tailles, couleurs, etc.)
          </p>
          <a
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Passer à Pro →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## 📊 Vérifications Côté Serveur

Dans vos API routes, vérifiez aussi les limites:

```typescript
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { getPlan, isWithinLimit } from '@/lib/plans';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const tenantId = await getCurrentTenantId();

  // Récupérer le plan
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true },
  });

  // Compter les produits actuels
  const productsCount = await prisma.product.count({
    where: { tenantId, isActive: true },
  });

  // Vérifier la limite
  if (!isWithinLimit(tenant.plan, 'maxProducts', productsCount)) {
    return NextResponse.json(
      { error: 'Limite de produits atteinte. Passez à Pro pour continuer.' },
      { status: 403 }
    );
  }

  // Continuer avec la création du produit
}
```

---

## 🎯 Prochaines Étapes

### Pour activer les paiements (Phase 2):

1. **Créer un compte Stripe** (https://stripe.com)

2. **Installer Stripe SDK**:
```bash
npm install stripe @stripe/stripe-js
```

3. **Créer les API routes Stripe**:
- `/api/stripe/create-checkout` - Créer une session de paiement
- `/api/stripe/webhook` - Gérer les webhooks Stripe
- `/api/stripe/portal` - Portail client Stripe

4. **Ajouter les boutons de paiement** dans `pricing/page.tsx`

5. **Synchroniser les statuts** via webhooks Stripe → mettre à jour `tenant.plan`

---

## ❓ Questions Fréquentes

**Q: Comment changer le plan d'un tenant manuellement?**

R: Via Prisma Studio ou SQL:
```sql
UPDATE "Tenant" SET "plan" = 'PRO' WHERE id = 'xxx';
```

**Q: Comment tester avec différents plans?**

R: Changez le plan dans la base de données, puis rafraîchissez la page.

**Q: Les limites sont-elles appliquées automatiquement?**

R: Non, vous devez utiliser les hooks `usePlanLimit` et vérifier côté serveur dans vos API routes.

**Q: Comment ajouter un essai gratuit de 14 jours?**

R: Ajoutez un champ `trialEndsAt` au modèle Tenant, et vérifiez-le dans vos vérifications de plan.

---

## 📝 Notes Importantes

1. **Toujours vérifier côté serveur**: Les vérifications côté client peuvent être contournées
2. **Gérer la rétrocompatibilité**: Les anciens tenants n'ont pas de plan défini, considérez-les comme FREE
3. **Communiquer clairement**: Expliquez pourquoi une feature est bloquée
4. **Offrir de la valeur**: Le plan gratuit doit être utilisable, mais créer le désir d'upgrader

---

Créé le 2025-12-20 par Claude
