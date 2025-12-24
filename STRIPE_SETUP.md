# Stripe Integration - Configuration Finale

## Étapes à suivre pour activer les paiements Stripe

### 1. Créer un compte Stripe

Si vous n'avez pas encore de compte Stripe:
1. Allez sur https://stripe.com
2. Créez un compte
3. Complétez les informations de votre entreprise

### 2. Obtenir les clés API Stripe

1. Connectez-vous au Dashboard Stripe: https://dashboard.stripe.com
2. Allez dans **Developers** > **API keys**
3. Copiez vos clés:
   - **Publishable key** (commence par `pk_test_...` en mode test)
   - **Secret key** (commence par `sk_test_...` en mode test)

### 3. Créer les produits et prix dans Stripe

1. Allez dans **Products** > **Add product**
2. Créez deux produits:

#### Plan PRO
- **Nom**: OperisCloud PRO
- **Description**: Plan professionnel pour petites entreprises
- **Prix**: 29 CHF / mois
- **Type**: Recurring (mensuel)
- **Copiez le Price ID** (commence par `price_...`)

#### Plan BUSINESS
- **Nom**: OperisCloud BUSINESS
- **Description**: Plan business pour entreprises établies
- **Prix**: 79 CHF / mois
- **Type**: Recurring (mensuel)
- **Copiez le Price ID** (commence par `price_...`)

### 4. Configurer le Webhook

1. Allez dans **Developers** > **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL du endpoint: `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez les événements suivants:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Webhook signing secret** (commence par `whsec_...`)

### 5. Mettre à jour les variables d'environnement

Ajoutez ces variables dans votre fichier `.env`:

```env
# Stripe Payment
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# Price IDs from Stripe Dashboard
STRIPE_PRICE_PRO=price_votre_price_id_pro
STRIPE_PRICE_BUSINESS=price_votre_price_id_business

# App URL
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### 6. Mettre à jour la base de données

Exécutez la migration Prisma pour ajouter les champs Stripe:

```bash
npm run db:push
```

### 7. Redémarrer l'application

```bash
npm run dev
```

## Tester l'intégration

### En mode Test (avec clés test)

1. Allez sur `/pricing`
2. Cliquez sur "Choisir ce plan" pour PRO ou BUSINESS
3. Vous serez redirigé vers Stripe Checkout
4. Utilisez une carte de test:
   - Numéro: `4242 4242 4242 4242`
   - Date: n'importe quelle date future
   - CVC: n'importe quel 3 chiffres
5. Complétez le paiement
6. Vous serez redirigé vers `/settings?success=true`
7. Vérifiez que votre plan a été mis à jour

### Tester le webhook localement

Pour tester les webhooks en local, utilisez Stripe CLI:

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La CLI affichera un webhook secret temporaire à utiliser dans `.env`.

## Passer en production

### 1. Activer votre compte Stripe

1. Dans le Dashboard Stripe, complétez les informations requises
2. Activez les paiements

### 2. Obtenir les clés de production

1. Allez dans **Developers** > **API keys**
2. Basculez en mode "Production"
3. Copiez les nouvelles clés (commencent par `pk_live_` et `sk_live_`)

### 3. Créer les produits en production

Recréez les produits PRO et BUSINESS en mode production et obtenez les nouveaux Price IDs.

### 4. Configurer le webhook en production

Créez un nouveau endpoint webhook pointant vers votre domaine de production.

### 5. Mettre à jour les variables d'environnement de production

Remplacez toutes les clés test par les clés de production dans votre serveur.

## Fonctionnalités implémentées

✅ **Checkout Session**: Créer une session de paiement pour PRO/BUSINESS
✅ **Webhook Handler**: Gérer les événements Stripe (paiement, annulation, etc.)
✅ **Customer Portal**: Permettre aux clients de gérer leur abonnement
✅ **Pricing Page**: Interface pour choisir un plan
✅ **Subscription Management**: Voir et gérer l'abonnement dans les paramètres

## Flux complet

1. **Utilisateur choisit un plan** → `/pricing`
2. **Clic sur "Choisir ce plan"** → Appel API `/api/stripe/create-checkout-session`
3. **Redirection vers Stripe Checkout** → Paiement sécurisé
4. **Paiement réussi** → Stripe envoie webhook `checkout.session.completed`
5. **Webhook met à jour la DB** → Plan activé automatiquement
6. **Redirection vers Settings** → Confirmation du changement de plan
7. **Gérer l'abonnement** → Bouton "Gérer mon abonnement" dans Settings
8. **Customer Portal** → Modifier paiement, voir factures, annuler

## Support

Si vous avez des questions sur Stripe:
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

## Sécurité

⚠️ **Important**:
- Ne committez JAMAIS vos clés API dans Git
- Utilisez toujours les clés test en développement
- Vérifiez les signatures webhook pour éviter les fraudes
- Les clés sont déjà dans `.gitignore` via le fichier `.env`
