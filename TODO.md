# 📝 TODO - BusinessHub

Liste complète des tâches à accomplir pour compléter le MVP et au-delà.

## 🔥 Priorité CRITIQUE (MVP Phase 1)

Ces fonctionnalités sont essentielles pour un MVP fonctionnel.

### Module Inventory (Produits)

#### API Routes
- [ ] `GET /api/products` - Liste des produits avec filtres, recherche, pagination
- [ ] `POST /api/products` - Créer un produit
- [ ] `GET /api/products/[id]` - Détails d'un produit
- [ ] `PATCH /api/products/[id]` - Modifier un produit
- [ ] `DELETE /api/products/[id]` - Supprimer un produit (soft delete)
- [ ] `POST /api/products/import` - Import CSV de produits
- [ ] `GET /api/products/export` - Export CSV/Excel
- [ ] `POST /api/products/[id]/variants` - Ajouter variante
- [ ] `GET /api/categories` - Liste catégories
- [ ] `POST /api/categories` - Créer catégorie

#### Pages
- [ ] `app/(dashboard)/inventory/page.tsx` - Liste des produits
  - [ ] Tableau avec colonnes : Image, Nom, SKU, Prix, Stock, Statut
  - [ ] Filtres : Catégorie, Type, Actif/Inactif, Stock bas
  - [ ] Recherche par nom/SKU
  - [ ] Pagination
  - [ ] Actions : Modifier, Supprimer, Dupliquer
- [ ] `app/(dashboard)/inventory/new/page.tsx` - Nouveau produit
  - [ ] Formulaire complet
  - [ ] Upload d'images
  - [ ] Gestion des variantes
  - [ ] Champs personnalisés selon industrie
- [ ] `app/(dashboard)/inventory/[id]/page.tsx` - Éditer produit
  - [ ] Même formulaire que création
  - [ ] Historique des modifications
  - [ ] Statistiques de vente
- [ ] `app/(dashboard)/inventory/categories/page.tsx` - Gérer catégories
  - [ ] Liste hiérarchique
  - [ ] Création rapide
  - [ ] Réorganisation drag & drop

#### Composants
- [ ] `ProductList` - Tableau des produits
- [ ] `ProductCard` - Carte produit (vue grille)
- [ ] `ProductForm` - Formulaire création/édition
- [ ] `VariantManager` - Gestion des variantes
- [ ] `ImageUploader` - Upload multiple d'images
- [ ] `StockBadge` - Badge de niveau de stock
- [ ] `ProductFilters` - Filtres de recherche
- [ ] `CategoryTree` - Arbre de catégories
- [ ] `ImportProductsDialog` - Dialog d'import CSV
- [ ] `ExportProductsDialog` - Dialog d'export

### Module Sales (Ventes)

#### API Routes
- [ ] `GET /api/orders` - Liste des commandes avec filtres
- [ ] `POST /api/orders` - Créer une commande
- [ ] `GET /api/orders/[id]` - Détails commande
- [ ] `PATCH /api/orders/[id]` - Modifier commande
- [ ] `PATCH /api/orders/[id]/status` - Changer le statut
- [ ] `POST /api/orders/[id]/invoice` - Générer PDF facture
- [ ] `POST /api/orders/[id]/convert` - Convertir devis en commande
- [ ] `GET /api/orders/stats` - Statistiques de ventes

#### Pages
- [ ] `app/(dashboard)/sales/page.tsx` - Liste des commandes
  - [ ] Tableau : Numéro, Client, Date, Montant, Statut, Paiement
  - [ ] Filtres : Statut, Canal, Période, Client
  - [ ] Recherche
  - [ ] Actions : Voir, Modifier, Facture PDF, Annuler
- [ ] `app/(dashboard)/sales/new/page.tsx` - Nouvelle commande
  - [ ] Sélection client (ou création rapide)
  - [ ] Ajout de produits (search + select)
  - [ ] Calcul automatique (sous-total, TVA, réductions, total)
  - [ ] Choix du canal de vente
  - [ ] Notes et notes internes
  - [ ] Statut initial
- [ ] `app/(dashboard)/sales/[id]/page.tsx` - Détail commande
  - [ ] Informations complètes
  - [ ] Timeline des changements de statut
  - [ ] Actions : Modifier statut, Générer facture, Envoyer email
  - [ ] Historique des paiements

#### Composants
- [ ] `OrderList` - Tableau des commandes
- [ ] `OrderForm` - Formulaire de commande
- [ ] `ProductSelector` - Recherche et sélection de produits
- [ ] `CustomerSelector` - Recherche/création client
- [ ] `OrderSummary` - Résumé avec calculs
- [ ] `OrderStatusBadge` - Badge de statut
- [ ] `PaymentStatusBadge` - Badge de paiement
- [ ] `InvoicePDF` - Template de facture PDF
- [ ] `OrderTimeline` - Timeline des événements
- [ ] `QuickSale` - Modal de vente rapide

### Module CRM (Clients)

#### API Routes
- [ ] `GET /api/customers` - Liste des clients
- [ ] `POST /api/customers` - Créer un client
- [ ] `GET /api/customers/[id]` - Détails client
- [ ] `PATCH /api/customers/[id]` - Modifier client
- [ ] `DELETE /api/customers/[id]` - Supprimer client
- [ ] `GET /api/customers/[id]/orders` - Commandes du client
- [ ] `GET /api/customers/[id]/stats` - Statistiques client
- [ ] `POST /api/customers/import` - Import clients
- [ ] `GET /api/customers/export` - Export liste clients

#### Pages
- [ ] `app/(dashboard)/crm/page.tsx` - Liste des clients
  - [ ] Tableau : Nom, Email, Téléphone, Commandes, Total dépensé, Dernière commande
  - [ ] Filtres : Segment, Tags, Période
  - [ ] Recherche
  - [ ] Vue carte vs tableau
- [ ] `app/(dashboard)/crm/new/page.tsx` - Nouveau client
  - [ ] Formulaire complet
  - [ ] Champs personnalisables
- [ ] `app/(dashboard)/crm/[id]/page.tsx` - Fiche client
  - [ ] Informations complètes
  - [ ] Historique des commandes
  - [ ] Statistiques (CLV, AOV, fréquence)
  - [ ] Notes
  - [ ] Timeline des interactions

#### Composants
- [ ] `CustomerList` - Tableau/Grille de clients
- [ ] `CustomerCard` - Carte client
- [ ] `CustomerForm` - Formulaire client
- [ ] `CustomerStats` - Widget de statistiques
- [ ] `CustomerTimeline` - Historique
- [ ] `CustomerSegmentBadge` - Badge de segment
- [ ] `TagManager` - Gestion des tags

### Module Finance (Finances)

#### API Routes
- [ ] `GET /api/expenses` - Liste des dépenses
- [ ] `POST /api/expenses` - Créer une dépense
- [ ] `GET /api/expenses/[id]` - Détails dépense
- [ ] `PATCH /api/expenses/[id]` - Modifier dépense
- [ ] `DELETE /api/expenses/[id]` - Supprimer dépense
- [ ] `GET /api/reports/financial` - Rapport financier
- [ ] `GET /api/reports/profit-loss` - Compte de résultat
- [ ] `POST /api/expenses/[id]/receipt` - Upload reçu

#### Pages
- [ ] `app/(dashboard)/finance/page.tsx` - Vue d'ensemble
  - [ ] Graphiques : Revenus vs Dépenses
  - [ ] Répartition par catégorie
  - [ ] Évolution mensuelle
- [ ] `app/(dashboard)/finance/expenses/page.tsx` - Liste dépenses
  - [ ] Tableau : Date, Titre, Catégorie, Montant, Reçu
  - [ ] Filtres : Catégorie, Période, Montant
  - [ ] Total et moyenne
- [ ] `app/(dashboard)/finance/expenses/new/page.tsx` - Nouvelle dépense
  - [ ] Formulaire complet
  - [ ] Upload de reçu/facture
  - [ ] Catégories selon industrie
- [ ] `app/(dashboard)/finance/reports/page.tsx` - Rapports
  - [ ] Différents types de rapports
  - [ ] Export Excel/PDF

#### Composants
- [ ] `ExpenseList` - Tableau des dépenses
- [ ] `ExpenseForm` - Formulaire de dépense
- [ ] `ReceiptUploader` - Upload de reçus
- [ ] `FinancialChart` - Graphiques revenus/dépenses
- [ ] `CategoryBreakdown` - Répartition par catégorie
- [ ] `ProfitLossReport` - Rapport P&L
- [ ] `ExpenseCategoryBadge` - Badge de catégorie

## 🟡 Priorité HAUTE (Post-MVP)

### Module Analytics

- [ ] `app/(dashboard)/analytics/page.tsx` - Dashboard analytics
- [ ] Graphiques de ventes par période
- [ ] Top produits par revenu/quantité
- [ ] Top clients
- [ ] Performance par canal de vente
- [ ] Panier moyen et évolution
- [ ] Taux de conversion
- [ ] Prévisions basiques

### Module Settings

#### Pages
- [ ] `app/(dashboard)/settings/page.tsx` - Paramètres généraux
  - [ ] Logo, couleurs, devise, langue
  - [ ] Timezone, format date
  - [ ] Modules activés/désactivés
- [ ] `app/(dashboard)/settings/team/page.tsx` - Gestion équipe
  - [ ] Liste des utilisateurs
  - [ ] Invitations
  - [ ] Gestion des rôles
- [ ] `app/(dashboard)/settings/billing/page.tsx` - Facturation
  - [ ] Plan actuel
  - [ ] Historique de facturation
  - [ ] Upgrade/Downgrade

### Intégrations

#### Stripe
- [ ] Setup compte Stripe
- [ ] Webhook endpoint
- [ ] Plans et pricing
- [ ] Portal client
- [ ] Gestion des limites par plan

#### Upload de Fichiers
- [ ] Setup Cloudinary ou S3
- [ ] API route d'upload
- [ ] Composant d'upload réutilisable
- [ ] Resize et optimisation d'images

#### PDF Generation
- [ ] Librairie PDF (react-pdf ou similar)
- [ ] Template de facture
- [ ] Template de devis
- [ ] Template de bon de livraison
- [ ] Personnalisation par tenant

## 🟢 Priorité MOYENNE (Phase 2)

### Module Gift Cards

- [ ] API routes CRUD gift cards
- [ ] Page de gestion
- [ ] Génération de codes uniques
- [ ] Application sur commandes
- [ ] Gestion des soldes

### Améliorations UX/UI

- [ ] Composants UI complets (Button, Input, Card, etc.)
- [ ] Notifications toast
- [ ] Loading states partout
- [ ] Error handling amélioré
- [ ] Modals réutilisables
- [ ] Tooltips informatifs
- [ ] Animations subtiles
- [ ] Dark mode
- [ ] Thème personnalisable par tenant

### Mobile

- [ ] Menu hamburger responsive
- [ ] Navigation mobile optimisée
- [ ] Gestes tactiles
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne basique

### Multilingue

- [ ] i18n setup (next-intl)
- [ ] Traductions EN complètes
- [ ] Traductions DE complètes
- [ ] Traductions IT complètes
- [ ] Sélecteur de langue
- [ ] Formatage selon locale

## 🔵 Priorité BASSE (Phase 3+)

### Features Avancées

- [ ] API publique REST
- [ ] Documentation API (Swagger)
- [ ] Webhooks
- [ ] White-label complet
- [ ] Domaines personnalisés
- [ ] Export de données complètes
- [ ] Import depuis autres plateformes
- [ ] Intégrations e-commerce (Shopify, WooCommerce)
- [ ] Intégrations comptables (Bexio, QuickBooks)
- [ ] Intégrations marketing (Mailchimp)

### AI & Automation

- [ ] Prévisions de ventes ML
- [ ] Recommandations de réassort
- [ ] Détection d'anomalies
- [ ] Chatbot support
- [ ] Analyse de sentiment
- [ ] Catégorisation automatique

### Mobile App

- [ ] React Native setup
- [ ] Scan de codes-barres
- [ ] Mode hors ligne complet
- [ ] Notifications push
- [ ] Géolocalisation

## 🐛 Bugs & Correctifs Connus

_Aucun pour le moment (première version)_

## 🔒 Sécurité & Compliance

- [ ] Audit de sécurité complet
- [ ] Row Level Security (RLS) PostgreSQL
- [ ] Rate limiting API
- [ ] CAPTCHA sur formulaires publics
- [ ] 2FA pour admins
- [ ] Logs de sécurité
- [ ] RGPD compliant
  - [ ] Export données utilisateur
  - [ ] Droit à l'oubli
  - [ ] Consentement cookies
  - [ ] Privacy policy
  - [ ] Terms of service
- [ ] Mentions légales
- [ ] CGU/CGV

## 📊 Monitoring & Analytics

- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics ou Google Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Logs centralisés

## 🧪 Tests

- [ ] Tests unitaires (Vitest)
- [ ] Tests d'intégration
- [ ] Tests E2E (Playwright)
- [ ] Tests de performance
- [ ] Tests de sécurité
- [ ] CI/CD pipeline

## 📚 Documentation

- [ ] Documentation API complète
- [ ] Guide utilisateur (français)
- [ ] User guides (EN, DE, IT)
- [ ] Video tutorials
- [ ] FAQ
- [ ] Troubleshooting guide
- [ ] Blog/Changelog public
- [ ] Status page

## 🚀 DevOps & Infrastructure

- [ ] Staging environment
- [ ] Preview deployments
- [ ] Database backups automatisés
- [ ] Disaster recovery plan
- [ ] CDN setup pour assets
- [ ] Monitoring des coûts
- [ ] Scaling strategy

---

## 📝 Notes

- Les tâches sont organisées par priorité
- Cochez les tâches au fur et à mesure
- Ajoutez de nouvelles tâches si nécessaire
- Gardez ce fichier à jour

**Dernière mise à jour** : Décembre 2024
