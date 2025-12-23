# Changelog

Toutes les modifications notables de BusinessHub seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

### À venir
- Module Inventory complet (liste, CRUD, variantes)
- Module Sales (commandes, factures)
- Module Finance (dépenses, rapports)
- Module CRM (clients)
- Intégration Stripe
- API publique

## [0.1.0] - 2024-12-18

### 🎉 Version Initiale - MVP Phase 1

#### Ajouté

**Core System**
- Architecture multi-tenant complète avec isolation des données
- Authentification Clerk avec support multilingue (FR, EN, DE, IT)
- Middleware de sécurité et protection des routes
- Système de rôles utilisateurs (OWNER, ADMIN, MANAGER, SELLER, VIEWER)

**Onboarding**
- Flow d'onboarding en 3 étapes
  1. Sélection de l'industrie
  2. Configuration de l'entreprise
  3. Confirmation et création
- Génération automatique de subdomain
- Vérification de disponibilité du subdomain
- Configuration automatique selon le template d'industrie

**Templates d'Industrie**
- **Mode & Vêtements** 👕
  - Variantes : Taille (XS-3XL), Couleur
  - Canaux : Stand/Marché, Site web, Instagram, Boutique
  - 8 catégories de dépenses spécifiques

- **Garage / Mécanique** 🔧
  - Types : Pièces détachées, Prestations
  - Variantes : Marque véhicule
  - 7 catégories de dépenses

- **Beauté & Bien-être** 💅
  - Types : Prestations, Produits de soin
  - Variantes : Format (30ml-500ml)
  - 6 catégories de dépenses

- **Restauration** 🍽️
  - Types : Plats, Boissons
  - Canaux : Sur place, À emporter, Livraison
  - 8 catégories de dépenses

- **Artisanat** 🎨
  - Types : Créations, Ateliers/Cours
  - Multi-canaux
  - 6 catégories de dépenses

- **Autre activité** 🏢
  - Configuration personnalisable

**Pages & UI**
- Landing page avec présentation du produit
- Pages d'authentification Sign In / Sign Up
- Dashboard principal avec statistiques :
  - Chiffre d'affaires du mois
  - Nombre de commandes
  - Clients totaux et nouveaux
  - Produits et alertes stock
  - Comparaison avec le mois précédent
  - Tableau des commandes récentes
  - Actions rapides
- Layout responsive avec :
  - Sidebar avec logo et navigation
  - Header avec profil utilisateur
  - Badge du plan d'abonnement
  - Support mobile

**API Routes**
- `/api/tenants/create` - Création de tenant avec configuration
- Validation Zod pour toutes les entrées
- Gestion des erreurs standardisée

**Base de Données**
- Schéma Prisma complet avec 12 modèles :
  - Tenant (organisation)
  - User (utilisateurs)
  - Product (catalogue)
  - ProductVariant (variantes produits)
  - Category (catégories)
  - Customer (CRM)
  - Order (ventes)
  - OrderItem (lignes de commande)
  - Expense (finances)
  - GiftCard (bons cadeaux)
- Relations optimisées
- Indexes pour performance
- Support complet des variantes
- Isolation par tenantId

**Utilitaires**
- Formatage devise (multi-devise)
- Formatage dates (FR, EN, DE, IT)
- Calculs de pourcentages
- Génération de numéros de commande
- Génération de codes gift card
- Helpers multi-tenant
- Validation avec Zod

**Documentation**
- README.md complet avec guide d'utilisation
- QUICKSTART.md pour setup rapide (5 min)
- DEPLOYMENT.md pour production Vercel
- FEATURES.md avec roadmap détaillée
- NEXT_STEPS.md avec plan d'action
- PROJECT_SUMMARY.md avec vue d'ensemble
- START_HERE.md comme point d'entrée
- Script de setup automatique

**Configuration**
- TypeScript strict
- ESLint avec règles Next.js
- TailwindCSS avec configuration personnalisée
- Prisma avec client auto-généré
- Variables d'environnement documentées

#### Stack Technique

**Frontend**
- Next.js 15.1.4 (App Router)
- React 19.0.0
- TypeScript 5.7.2
- TailwindCSS 3.4.17

**Backend**
- Next.js API Routes
- Prisma 6.3.0
- PostgreSQL (Neon/Supabase compatible)

**Auth & User Management**
- Clerk 6.14.1 (multi-tenant natif)
- Localisation FR

**UI & Forms**
- Lucide React (icônes)
- React Hook Form 7.54.2
- Zod 3.24.1 (validation)
- Recharts 2.15.0 (graphiques)

**Utilitaires**
- clsx & tailwind-merge (classes CSS)
- xlsx 0.18.5 (exports Excel)

#### Infrastructure

**Deployment**
- Optimisé pour Vercel
- Support subdomain wildcard
- Build optimisé production
- Edge runtime compatible

**Database**
- Support PostgreSQL 14+
- Connection pooling ready
- SSL support
- Migration ready

**Security**
- Row-level isolation par tenant
- Authentication Clerk (SOC 2)
- HTTPS only
- Input validation
- XSS protection

### Notes de Version

Cette version 0.1.0 est le **MVP initial** de BusinessHub. Elle contient :
- ✅ L'architecture complète et scalable
- ✅ Le système d'onboarding fonctionnel
- ✅ Le dashboard avec statistiques
- ✅ La base pour tous les modules
- 🚧 Modules métier (Inventory, Sales, Finance) à implémenter

**Public cible** : Beta testeurs et early adopters
**Statut** : Développement actif
**Disponibilité** : Code prêt, modules en cours d'implémentation

### Breaking Changes
N/A (première version)

### Deprecated
N/A (première version)

### Removed
N/A (première version)

### Fixed
N/A (première version)

### Security
- Isolation complète des données par tenant
- Authentication sécurisée via Clerk
- Validation des inputs avec Zod
- Protection CSRF via Next.js
- Headers de sécurité configurés

---

## Format du Changelog

### Types de changements

- `Ajouté` pour les nouvelles fonctionnalités
- `Modifié` pour les changements aux fonctionnalités existantes
- `Déprécié` pour les fonctionnalités bientôt supprimées
- `Retiré` pour les fonctionnalités supprimées
- `Corrigé` pour les corrections de bugs
- `Sécurité` en cas de vulnérabilités

### Numérotation des versions

Nous suivons [Semantic Versioning](https://semver.org/lang/fr/) :

- **MAJOR** (X.0.0) : Changements incompatibles de l'API
- **MINOR** (0.X.0) : Nouvelles fonctionnalités (rétrocompatible)
- **PATCH** (0.0.X) : Corrections de bugs (rétrocompatible)

Exemple :
- `0.1.0` → `0.2.0` : Ajout du module Inventory
- `0.2.0` → `0.2.1` : Correction de bug dans Inventory
- `0.9.0` → `1.0.0` : Lancement production avec breaking changes

---

[Non publié]: https://github.com/votreusername/businesshub/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/votreusername/businesshub/releases/tag/v0.1.0
