# 📋 Résumé du Système de Plans - BusinessHub

## ✅ Ce qui a été implémenté

### 1. Infrastructure de Base

#### Configuration des Plans
- **Fichier**: `lib/plans.ts`
- **Plans définis**:
  - **FREE**: 50 produits, 30 commandes/mois, 1 utilisateur, 30 jours d'historique
  - **PRO**: 500 produits, 200 commandes/mois, 3 utilisateurs, 1 an d'historique - **29 CHF/mois**
  - **BUSINESS**: Tout illimité, 10 utilisateurs - **79 CHF/mois**
  - **ENTERPRISE**: Sur mesure

#### Types TypeScript
- **Fichier**: `lib/types/plans.ts`
- Définit les interfaces pour `Plan`, `PlanLimits`, `PlanFeatures`, `UsageStats`

### 2. API & Hooks

#### API Endpoint
- **Route**: `/api/plan/usage`
- Retourne le plan actuel + statistiques d'utilisation en temps réel

#### Hooks React
- **Fichier**: `lib/hooks/usePlanLimit.ts`
- `usePlanLimit(limitType)`: Vérifie les limites (produits, commandes, clients, users)
- `usePlanFeature(feature)`: Vérifie si une feature est disponible

### 3. Composants UI

#### Modal d'Upgrade
- **Fichier**: `components/paywall/UpgradeModal.tsx`
- Modal professionnel pour encourager l'upgrade
- Affiche les bénéfices du plan supérieur
- CTA vers la page pricing

#### Indicateurs d'Utilisation
- **Fichier**: `components/paywall/UsageIndicator.tsx`
- Barre de progression colorée
- Alertes quand proche de la limite (>80%)
- Cliquable pour afficher le modal d'upgrade

#### Widget Dashboard
- **Fichier**: `components/dashboard/PlanUsageWidget.tsx`
- Widget prêt à intégrer dans le dashboard
- Affiche 2 indicateurs principaux (produits + commandes)

### 4. Page de Tarification

- **Route**: `/pricing`
- **Fichier**: `app/(dashboard)/pricing/page.tsx`
- Tableau comparatif des 3 plans
- Toggle mensuel/annuel
- Section Enterprise
- Design professionnel et responsive

---

## 🎯 Comment Ça Marche

### Workflow Utilisateur

1. **Utilisateur FREE crée un 50ème produit**
   → `usePlanLimit('products')` retourne `canCreate: false`
   → Bouton "Nouveau produit" affiche le modal d'upgrade
   → Utilisateur voit les bénéfices du plan PRO
   → Peut cliquer "Voir tous les plans" → `/pricing`

2. **Utilisateur FREE essaie d'accéder aux variantes**
   → `usePlanFeature('hasVariants')` retourne `hasAccess: false`
   → Interface de variantes est remplacée par un paywall visuel
   → CTA "Débloquer avec Pro - 29 CHF/mois"

3. **Vérification serveur (protection)**
   → API route vérifie avec `isWithinLimit()`
   → Si limite atteinte → retourne 403 avec code `PLAN_LIMIT_REACHED`
   → Frontend affiche automatiquement le modal d'upgrade

---

## 📊 Répartition des Features par Plan

### Plan GRATUIT (FREE)
✅ Dashboard basique
✅ 50 produits maximum
✅ 30 commandes/mois maximum
✅ Gestion clients basique (25 max)
✅ Stats 7 derniers jours
❌ Pas de variantes
❌ Pas de cartes cadeaux
❌ Pas de module Finance
❌ Pas de PDF
❌ Pas d'import Excel

### Plan PRO (29 CHF/mois)
✅ Tout du plan FREE, PLUS:
✅ 500 produits
✅ 200 commandes/mois
✅ Clients illimités
✅ 3 utilisateurs
✅ **Variantes de produits** ⭐
✅ **Cartes cadeaux** ⭐
✅ **Module Finance** ⭐
✅ **Génération PDF** ⭐
✅ **Import Excel** ⭐
✅ **Analytiques avancées** ⭐
✅ **Alertes stock bas** ⭐
❌ Segmentation clients
❌ Rôles/Permissions
❌ API Access

### Plan BUSINESS (79 CHF/mois)
✅ Tout du plan PRO, PLUS:
✅ Produits illimités
✅ Commandes illimitées
✅ 10 utilisateurs
✅ **Segmentation clients** ⭐⭐
✅ **Rôles & Permissions** ⭐⭐
✅ **API Access** ⭐⭐
✅ **Champs personnalisés** ⭐⭐
✅ **Automatisations** ⭐⭐

---

## 🔐 Sécurité & Validation

### Protection à 2 Niveaux

#### 1. Côté Client (UX)
```typescript
const { canCreate } = usePlanLimit('products');
if (!canCreate) {
  showUpgradeModal();
  return;
}
```

#### 2. Côté Serveur (Sécurité)
```typescript
const productsCount = await prisma.product.count({ where: { tenantId } });
if (!isWithinLimit(plan, 'maxProducts', productsCount)) {
  return Response403('PLAN_LIMIT_REACHED');
}
```

⚠️ **IMPORTANT**: Toujours vérifier côté serveur! Les vérifications client peuvent être contournées.

---

## 🚀 Prochaines Étapes (Non implémentées)

### Phase 2: Paiements Stripe (1-2 jours)

1. **Setup Stripe**
   - Créer compte Stripe
   - Installer SDK: `npm install stripe @stripe/stripe-js`
   - Ajouter clés dans `.env`: `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`

2. **API Routes Stripe**
   - `/api/stripe/create-checkout` - Créer session de paiement
   - `/api/stripe/webhook` - Gérer webhooks (paiement réussi, annulation, etc.)
   - `/api/stripe/portal` - Portail client (gérer abonnement, factures)

3. **Intégration Frontend**
   - Modifier les boutons de la page `/pricing` pour rediriger vers Stripe Checkout
   - Ajouter page de succès: `/pricing/success`
   - Ajouter page d'annulation: `/pricing/cancelled`

4. **Synchronisation**
   - Webhook Stripe → mise à jour `tenant.plan` en base de données
   - Webhook Stripe → envoi d'email de confirmation

### Phase 3: Gestion Avancée (2-3 jours)

1. **Essai Gratuit 14 jours**
   - Ajouter champ `trialEndsAt` au modèle Tenant
   - Modifier la logique de vérification pour tenir compte du trial
   - UI pour afficher "X jours restants dans votre essai"

2. **Downgrade/Upgrade**
   - Page `/settings/billing` pour gérer l'abonnement
   - Logique de downgrade (que se passe-t-il si l'utilisateur a >50 produits et downgrade vers FREE?)
   - Proration des paiements

3. **Analytics de Conversion**
   - Tracker les clics sur "Upgrade"
   - Tracker les vues de la page `/pricing`
   - A/B testing des messages de paywall

4. **Emails Transactionnels**
   - Email de bienvenue (plan FREE)
   - Email "limite atteinte" (automatique à 80% et 100%)
   - Email de remerciement (après upgrade)
   - Email de rappel de fin d'essai (3 jours avant expiration)

---

## 📁 Structure des Fichiers Créés

```
BusinessHub/
├── lib/
│   ├── types/
│   │   └── plans.ts              # Types TypeScript
│   ├── hooks/
│   │   └── usePlanLimit.ts       # Hooks React
│   └── plans.ts                  # Configuration des plans
│
├── components/
│   ├── paywall/
│   │   ├── UpgradeModal.tsx      # Modal d'upgrade
│   │   └── UsageIndicator.tsx    # Indicateur avec barre
│   └── dashboard/
│       └── PlanUsageWidget.tsx   # Widget dashboard
│
├── app/
│   ├── api/
│   │   └── plan/
│   │       └── usage/
│   │           └── route.ts      # API endpoint
│   └── (dashboard)/
│       └── pricing/
│           └── page.tsx          # Page de tarification
│
├── PLAN_SYSTEM_README.md         # Documentation complète
├── EXEMPLE_INTEGRATION.md        # Exemples d'utilisation
└── PLAN_SUMMARY.md              # Ce fichier
```

---

## 💡 Conseils d'Utilisation

### Pour Tester

1. **Changer le plan d'un tenant**:
   ```sql
   UPDATE "Tenant" SET "plan" = 'PRO' WHERE id = 'xxx';
   ```

2. **Simuler une limite atteinte**:
   - Créez 50 produits
   - Essayez d'en créer un 51ème
   - Le paywall devrait s'afficher

3. **Tester les features**:
   - Plan FREE → variantes bloquées
   - Plan PRO → variantes accessibles
   - Plan FREE → PDF bloqué
   - Plan PRO → PDF accessible

### Pour Intégrer

Consultez `EXEMPLE_INTEGRATION.md` pour des exemples concrets de:
- Bloquer la création de produits
- Bloquer les variantes
- Bloquer la génération de PDF
- Bloquer l'import Excel
- Limiter les filtres analytics

---

## 🎨 Personnalisation

### Modifier les Prix

Dans `lib/plans.ts`, changez:
```typescript
PRO: {
  price: {
    monthly: 29,  // Changez ici
    yearly: 290,  // Et ici
  }
}
```

### Modifier les Limites

Dans `lib/plans.ts`, changez:
```typescript
FREE: {
  limits: {
    maxProducts: 50,        // Changez ici
    maxOrdersPerMonth: 30,  // Et ici
    // ...
  }
}
```

### Ajouter une Feature

1. Ajoutez dans `lib/types/plans.ts`:
```typescript
export interface PlanFeatures {
  // ... features existantes
  hasMyNewFeature: boolean;
}
```

2. Configurez dans `lib/plans.ts` pour chaque plan

3. Utilisez dans votre code:
```typescript
const { hasAccess } = usePlanFeature('hasMyNewFeature');
```

---

## 📞 Support

Pour toute question sur l'implémentation:
1. Consultez `PLAN_SYSTEM_README.md` pour la doc complète
2. Consultez `EXEMPLE_INTEGRATION.md` pour des exemples
3. Vérifiez que vous avez bien vérifié côté serveur ET client

---

## ✨ Résultat Final

Vous avez maintenant:
✅ Un système de plans complet et fonctionnel
✅ Une page de tarification professionnelle
✅ Des paywalls visuels pour encourager l'upgrade
✅ Une protection côté serveur
✅ Une excellente UX avec des modals informatifs
✅ Une base solide pour ajouter Stripe plus tard

**Total estimé**: Infrastructure représente ~70% du travail.
Il reste ~30% pour l'intégration Stripe + emails + analytics.

Prochaine étape recommandée: **Intégrer Stripe pour accepter les paiements** 💳

---

Créé le 2025-12-20 par Claude
