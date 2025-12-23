# 🚀 Quick Start - Système de Plans BusinessHub

## En 5 Minutes: Testez le Système

### 1. Accédez à la Page de Tarification

Naviguez vers: **http://localhost:3000/pricing**

Vous verrez:
- 3 plans (FREE, PRO, BUSINESS)
- Toggle mensuel/annuel
- Tableau comparatif des fonctionnalités
- Section Enterprise

### 2. Testez un Indicateur d'Utilisation

Ajoutez ce code temporaire dans votre dashboard:

```tsx
// Dans app/(dashboard)/dashboard/page.tsx
import PlanUsageWidget from '@/components/dashboard/PlanUsageWidget';

export default async function DashboardPage() {
  // ... votre code existant

  return (
    <div className="space-y-6">
      {/* Vos composants existants */}

      {/* NOUVEAU: Ajoutez ce widget */}
      <PlanUsageWidget />
    </div>
  );
}
```

Rafraîchissez → Vous verrez un widget affichant votre utilisation actuelle.

### 3. Testez le Modal d'Upgrade

Créez une page de test:

```tsx
// Créez app/(dashboard)/test-paywall/page.tsx
'use client';

import { useState } from 'react';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';

export default function TestPaywallPage() {
  const { canCreate, plan, currentUsage, limit } = usePlanLimit('products');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test du Système de Plans</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Informations Actuelles:</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>Plan:</strong> {plan}</li>
          <li><strong>Produits:</strong> {currentUsage}/{limit === 0 ? '∞' : limit}</li>
          <li><strong>Peut créer:</strong> {canCreate ? '✅ Oui' : '❌ Non - Limite atteinte'}</li>
        </ul>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Tester le Modal d'Upgrade
      </button>

      <UpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature="Test Feature"
        featureDescription="Ceci est un test du modal d'upgrade."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </div>
  );
}
```

Naviguez vers: **http://localhost:3000/test-paywall**

---

## 🎯 Test Complet: Bloquer la Création de Produits

### Étape 1: Vérifiez votre plan actuel

```sql
-- Dans Prisma Studio ou votre DB client
SELECT plan FROM "Tenant" WHERE id = 'VOTRE_TENANT_ID';
```

### Étape 2: Créez 50 produits (si plan FREE)

Vous pouvez:
- Les créer manuellement via l'interface
- Utiliser l'import Excel (si vous avez PRO)
- Utiliser Prisma Studio pour en créer rapidement

### Étape 3: Modifiez la Page Inventory

Éditez `app/(dashboard)/inventory/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';
import UsageIndicator from '@/components/paywall/UsageIndicator';

export default function InventoryPage() {
  const { canCreate, requiresUpgrade, plan } = usePlanLimit('products');
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleNewProductClick = (e: React.MouseEvent) => {
    if (requiresUpgrade) {
      e.preventDefault();
      setShowUpgrade(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventaire</h1>

        <Link
          href={canCreate ? "/inventory/new" : "#"}
          onClick={handleNewProductClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            canCreate
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          <Plus className="h-5 w-5" />
          {canCreate ? 'Nouveau produit' : 'Limite atteinte'}
        </Link>
      </div>

      {/* Afficher l'indicateur d'utilisation */}
      <UsageIndicator limitType="products" />

      {/* Votre tableau de produits existant */}
      {/* ... */}

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        feature="Produits illimités"
        featureDescription="Vous avez atteint la limite de 50 produits du plan gratuit. Passez à Pro pour gérer jusqu'à 500 produits."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </div>
  );
}
```

### Étape 4: Testez!

1. Avec 50 produits (plan FREE) → Bouton "Nouveau produit" est désactivé
2. Cliquez dessus → Modal d'upgrade s'affiche
3. Changez le plan en PRO dans la DB → Le bouton redevient actif

---

## 🔄 Changer de Plan (Pour Tester)

### Via Prisma Studio:
1. Ouvrez: `npx prisma studio`
2. Allez dans le modèle `Tenant`
3. Trouvez votre tenant
4. Changez le champ `plan` vers: `FREE`, `PRO`, ou `BUSINESS`
5. Sauvegardez
6. Rafraîchissez votre page

### Via SQL:
```sql
-- Passer en PRO
UPDATE "Tenant"
SET "plan" = 'PRO'
WHERE id = 'VOTRE_TENANT_ID';

-- Retourner en FREE
UPDATE "Tenant"
SET "plan" = 'FREE'
WHERE id = 'VOTRE_TENANT_ID';
```

---

## 🎨 Customisation Rapide

### Changer les Couleurs du Modal

Dans `components/paywall/UpgradeModal.tsx`, changez:
```tsx
className="bg-blue-600"  // Changez blue-600 vers votre couleur
```

### Changer les Prix

Dans `lib/plans.ts`:
```typescript
PRO: {
  price: {
    monthly: 29,  // CHF/mois
    yearly: 290,  // CHF/an (économie de ~2 mois)
  }
}
```

### Changer les Limites

Dans `lib/plans.ts`:
```typescript
FREE: {
  limits: {
    maxProducts: 50,        // Nombre de produits
    maxOrdersPerMonth: 30,  // Commandes par mois
    maxUsers: 1,            // Utilisateurs
    dataRetentionDays: 30,  // Jours d'historique
  }
}
```

---

## 🐛 Debugging

### Le hook retourne toujours `canCreate: true`

**Cause**: L'API `/api/plan/usage` ne retourne pas les bonnes données

**Solution**:
1. Vérifiez dans le Network tab du navigateur
2. Appelez manuellement: `http://localhost:3000/api/plan/usage`
3. Vérifiez que le `tenantId` est correct
4. Vérifiez que le champ `plan` existe dans votre table `Tenant`

### Le modal ne s'affiche pas

**Cause**: État `isOpen` n'est pas géré correctement

**Solution**:
```tsx
const [showModal, setShowModal] = useState(false);

<UpgradeModal
  isOpen={showModal}  // Assurez-vous que c'est bien connecté
  onClose={() => setShowModal(false)}
  // ...
/>
```

### Les indicateurs n'affichent rien

**Cause**: Limite illimitée (0)

**Explication**: Si `limit === 0`, l'indicateur ne s'affiche pas (car illimité).
C'est normal pour les plans PRO/BUSINESS.

---

## 📚 Documentation Complète

- **`PLAN_SYSTEM_README.md`**: Guide complet d'utilisation
- **`EXEMPLE_INTEGRATION.md`**: Exemples concrets pour chaque feature
- **`PLAN_SUMMARY.md`**: Vue d'ensemble du système
- **`QUICK_START.md`**: Ce fichier

---

## ✅ Checklist de Validation

Avant de passer en production:

- [ ] Testez avec un plan FREE (limites actives)
- [ ] Testez avec un plan PRO (certaines limites désactivées)
- [ ] Testez avec un plan BUSINESS (tout illimité)
- [ ] Vérifiez que les vérifications serveur fonctionnent (403 errors)
- [ ] Vérifiez que les modals s'affichent correctement
- [ ] Vérifiez que la page `/pricing` est accessible
- [ ] Vérifiez que les indicateurs d'utilisation sont précis
- [ ] Testez le responsive design (mobile, tablette, desktop)

---

## 🚀 Prêt à Passer en Production?

### Avant de lancer:

1. **Configurez Stripe** (voir `PLAN_SUMMARY.md` - Phase 2)
2. **Ajoutez les emails transactionnels**
3. **Configurez les webhooks Stripe**
4. **Testez le flux de paiement complet**
5. **Ajoutez Google Analytics ou autre tracking**

### Le Minimum Viable:

Si vous voulez lancer rapidement sans Stripe:
1. Gardez tout en FREE pour l'instant
2. Collectez les emails des intéressés sur `/pricing`
3. Activez les comptes PRO manuellement en changeant le plan dans la DB
4. Facturez via PayPal ou virement bancaire
5. Implémentez Stripe une fois que vous avez vos premiers clients payants

---

Bon développement! 💪

Si vous avez des questions, consultez la documentation complète dans les fichiers README.
