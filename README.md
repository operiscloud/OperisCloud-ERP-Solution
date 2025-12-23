# OperisCloud - Solution ERP pour PME et Artisans Suisses

## Vue d'ensemble

OperisCloud est une solution ERP SaaS multi-tenant spécialement conçue pour les PME suisses et artisans. Gérez facilement vos produits, clients, ventes, finances et obtenez des analytics détaillés - le tout dans une interface intuitive et sécurisée.

### Caractéristiques principales

- **Multi-tenant** : Chaque entreprise a son propre espace isolé
- **Templates d'industrie** : Configurations préconfigurées (Mode, Garage, Beauté, etc.)
- **Modulaire** : Activez uniquement les modules nécessaires
- **Mobile-first** : Interface responsive optimisée pour mobile
- **Multilingue** : Support FR, EN, DE, IT

## Stack Technique

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL/MySQL (Neon ou Hostinger)
- **Auth**: Clerk (multi-tenant, support français)
- **Security**: Rate limiting, RBAC, headers de sécurité
- **Deployment**: Hostinger Business Plan (ou Vercel)

## Installation

### Prérequis

- Node.js 18+ et npm
- PostgreSQL database (local ou cloud)
- Compte Clerk (gratuit pour commencer)

### Étape 1 : Installation des dépendances

```bash
npm install
```

### Étape 2 : Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/operiscloud?schema=public"
# OU pour MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/operiscloud"

# Clerk Authentication
# Créez une application sur https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=operiscloud.local
```

> **Note :** Ne commitez JAMAIS le fichier `.env` avec vos vraies clés API dans Git!

### Étape 3 : Configuration de Clerk

1. Créez un compte sur [https://clerk.com](https://clerk.com)
2. Créez une nouvelle application
3. Dans Settings > Localization, ajoutez le français
4. Copiez vos clés API dans le fichier `.env`

### Étape 4 : Configuration de la base de données

#### Option A : PostgreSQL local

```bash
# Installer PostgreSQL
brew install postgresql  # macOS
# ou installez depuis postgresql.org

# Créer la base de données
createdb businesshub
```

#### Option B : Neon (PostgreSQL cloud - Recommandé)

1. Créez un compte sur [https://neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la DATABASE_URL dans votre `.env`

#### Option C : Supabase

1. Créez un compte sur [https://supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez la connection string PostgreSQL (pas la pooling URL)
4. Copiez-la dans DATABASE_URL

### Étape 5 : Initialiser Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma db push

# (Optionnel) Ouvrir Prisma Studio pour voir vos données
npx prisma studio
```

### Étape 6 : Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
businesshub/
├── app/
│   ├── (auth)/              # Pages d'authentification
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── onboarding/      # Flow de création de tenant
│   ├── (dashboard)/         # Pages protégées
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── inventory/       # Module Produits
│   │   ├── crm/            # Module Clients
│   │   ├── sales/          # Module Ventes
│   │   ├── finance/        # Module Finances
│   │   └── analytics/      # Module Rapports
│   ├── api/                # API Routes
│   │   └── tenants/
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Composants du dashboard
│   ├── forms/             # Formulaires réutilisables
│   ├── layout/            # Navigation, header
│   └── ui/                # Composants UI de base
├── lib/
│   ├── prisma.ts          # Client Prisma
│   ├── tenant.ts          # Utilitaires multi-tenant
│   ├── validations.ts     # Schémas Zod
│   ├── utils.ts           # Utilitaires généraux
│   └── industry-templates.ts  # Templates d'industrie
├── prisma/
│   └── schema.prisma      # Schéma de la base de données
├── types/
│   └── index.ts           # Types TypeScript
└── public/
```

## Modules Disponibles

### 1. Core (Obligatoire)
- Authentification multi-utilisateurs
- Gestion des rôles
- Dashboard personnalisable
- Paramètres tenant

### 2. Inventory (Gestion des Produits)
- Catalogue produits avec variantes
- Gestion des stocks multi-dépôts
- Alertes stock bas
- Codes-barres / SKU
- Import/Export CSV

### 3. CRM (Clients)
- Fiches clients complètes
- Historique des interactions
- Segmentation
- Statistiques par client

### 4. Sales (Ventes)
- Création de devis/commandes/factures
- Multi-canaux de vente
- Gestion des paiements
- Bons de livraison

### 5. Finance (Comptabilité)
- Suivi des dépenses
- Catégories configurables
- Upload factures
- Rapports financiers

### 6. Gift Cards (Bons Cadeaux)
- Création de bons cadeaux
- Gestion des soldes
- Codes uniques

### 7. Analytics (Rapports)
- Statistiques détaillées
- Graphiques
- Exports Excel
- Prévisions

## Templates d'Industrie

Le système inclut 6 templates préconfigurés :

1. **Mode & Vêtements** 👕
   - Variantes : Taille, Couleur
   - Canaux : Stand/Marché, Site web, Instagram
   - Catégories de dépenses : Production, Tissus, Marketing, Stand

2. **Garage / Mécanique** 🔧
   - Types : Pièces détachées, Prestations
   - Variantes : Marque véhicule
   - Catégories : Pièces, Outillage, Loyer atelier

3. **Beauté & Bien-être** 💅
   - Types : Prestations, Produits de soin
   - Canaux : Salon, Domicile
   - Catégories : Produits, Loyer salon, Formation

4. **Restauration** 🍽️
   - Types : Plats, Boissons
   - Canaux : Sur place, À emporter, Livraison

5. **Artisanat** 🎨
   - Types : Créations, Ateliers/Cours
   - Canaux : Atelier, Marché, En ligne

6. **Autre activité** 🏢
   - Configuration personnalisable

## Développement

### Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linter
npm run lint

# Prisma Studio (GUI pour la DB)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Reset la base de données (ATTENTION : supprime toutes les données)
npx prisma migrate reset
```

### Ajouter un nouveau module

1. Créer le modèle Prisma dans `prisma/schema.prisma`
2. Créer les routes API dans `app/api/`
3. Créer les pages dans `app/(dashboard)/module-name/`
4. Ajouter au menu dans `components/layout/DashboardNav.tsx`
5. Mettre à jour le template d'industrie si nécessaire

## Plans d'Abonnement

### FREE (Gratuit)
- 1 utilisateur
- 50 produits max
- 100 commandes/mois
- Modules de base

### PRO (29€/mois)
- 3 utilisateurs
- Produits illimités
- Commandes illimitées
- Tous les modules
- Support prioritaire

### BUSINESS (79€/mois)
- Utilisateurs illimités
- API access
- White-label
- Support dédié

## Multi-tenant

### Comment ça marche

Chaque tenant (entreprise) est complètement isolé :

1. **Subdomain** : `monentreprise.businesshub.app`
2. **Données isolées** : Toutes les requêtes filtrent par `tenantId`
3. **Row Level Security** : Sécurité au niveau PostgreSQL
4. **Settings personnalisés** : Logo, couleurs, devise, langue

### Créer un nouveau tenant

Les utilisateurs créent leur tenant via le flow d'onboarding :

1. Inscription avec Clerk
2. Sélection de l'industrie
3. Configuration de l'entreprise
4. Choix du subdomain
5. Création automatique du tenant

## Déploiement

### Documentation Complète

Pour déployer OperisCloud en production :

📖 **[Guide de Déploiement Hostinger](./DEPLOYMENT.md)** - Guide complet étape par étape

🔒 **[Rapport de Sécurité](./SECURITY.md)** - Mesures de sécurité implémentées

### Résumé Rapide - Hostinger

1. Configurez la base de données MySQL sur Hostinger
2. Uploadez le code via Git ou FTP
3. Configurez les variables d'environnement
4. Exécutez `npm install && npx prisma generate && npm run build`
5. Démarrez avec PM2 : `pm2 start npm --name "operiscloud" -- start`
6. Activez SSL gratuit Let's Encrypt

### Alternative - Vercel

1. Push votre code sur GitHub
2. Importez sur [Vercel](https://vercel.com)
3. Configurez les variables d'environnement
4. Déployez automatiquement

### Variables d'environnement production

- `DATABASE_URL` - URL de connexion DB
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clé publique Clerk
- `CLERK_SECRET_KEY` - Clé secrète Clerk (garder confidentielle!)
- `NEXT_PUBLIC_APP_URL` - Votre domaine (https://votredomaine.com)
- `NEXT_PUBLIC_APP_DOMAIN` - Domaine de base
- `NODE_ENV=production`

## Roadmap

### Phase 1 - MVP (✅ TERMINÉ - Décembre 2025)
- ✅ Auth multi-tenant avec Clerk
- ✅ Templates d'industrie (6 templates)
- ✅ Dashboard complet avec statistiques
- ✅ Module Inventory (produits, variantes, stock)
- ✅ Module Sales (devis, commandes, factures)
- ✅ Module CRM (clients, segmentation)
- ✅ Module Finance (dépenses, rapports)
- ✅ Module Gift Cards (bons cadeaux)
- ✅ Module Analytics (graphiques, exports)
- ✅ Génération PDF personnalisable
- ✅ Import/Export Excel
- ✅ Sécurité renforcée (rate limiting, RBAC, headers)
- ✅ SEO optimisé
- ✅ Landing page professionnelle
- ✅ Prêt pour déploiement Hostinger

### Phase 2 - Growth (Q1-Q2 2026)
- [ ] Intégration Stripe pour paiements
- [ ] Plans d'abonnement actifs (FREE/PRO/BUSINESS)
- [ ] App mobile (iOS/Android)
- [ ] Webhooks et API publique
- [ ] Intégrations tierces (comptabilité, e-commerce)
- [ ] Notifications push et email
- [ ] Support multilingue complet (DE, IT, EN)

### Phase 3 - Scale (Q3-Q4 2026)
- [ ] White-label pour revendeurs
- [ ] AI pour prévisions et recommandations
- [ ] Module RH (gestion équipe avancée)
- [ ] Module Production/Fabrication
- [ ] Marketplace d'extensions
- [ ] Infrastructure multi-région

## Support & Documentation

### Documentation

- 📖 **[Guide de Déploiement](./DEPLOYMENT.md)** - Comment déployer sur Hostinger
- 🔒 **[Rapport de Sécurité](./SECURITY.md)** - Mesures de sécurité
- 📝 **[README](./README.md)** - Guide d'installation et utilisation

### Support

Pour toute question ou problème :

1. 📚 Consultez la documentation complète
2. 🐛 Signalez les bugs via GitHub Issues
3. 💬 Contactez le support : support@operiscloud.com

### Contributeurs

Développé avec ❤️ pour les PME et artisans suisses

## Sécurité

OperisCloud prend la sécurité au sérieux :

- ✅ Rate limiting sur tous les endpoints sensibles
- ✅ Validation stricte des fichiers uploadés
- ✅ Headers de sécurité (CSP, HSTS, X-Frame-Options)
- ✅ RBAC (contrôle d'accès basé sur les rôles)
- ✅ Protection SQL injection via Prisma ORM
- ✅ Authentication sécurisée via Clerk

Consultez [SECURITY.md](./SECURITY.md) pour plus de détails.

## Licence

**Propriétaire** - Tous droits réservés © 2025 OperisCloud

Ce logiciel est la propriété exclusive d'OperisCloud. Toute utilisation, modification ou distribution non autorisée est strictement interdite.

---

<div align="center">

**OperisCloud** - La solution ERP pensée pour les PME suisses 🇨🇭

[Site Web](https://operiscloud.com) • [Documentation](./DEPLOYMENT.md) • [Support](mailto:support@operiscloud.com)

</div>
