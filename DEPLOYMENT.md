# Déploiement en Production - OperisCloud

Guide pour déployer OperisCloud sur Hostinger Business Plan.

## Prérequis

- Plan Hostinger Business activé
- Accès au panneau de contrôle Hostinger (hPanel)
- Node.js 18+ supporté
- Base de données MySQL ou PostgreSQL
- Compte Clerk configuré pour la production

## Étape 1 : Préparer la Base de Données sur Hostinger

1. Connectez-vous au hPanel Hostinger
2. Allez dans "Bases de données" > "Gérer"
3. Créez une nouvelle base de données MySQL :
   - Nom : `operiscloud_prod`
   - Utilisateur : créez un utilisateur dédié
   - Mot de passe : **générez un mot de passe fort et notez-le**
4. Notez les informations de connexion :
   - Hôte : `localhost` (ou l'hôte fourni par Hostinger)
   - Port : `3306` (MySQL par défaut)
   - Base de données : `operiscloud_prod`
   - Utilisateur : le nom d'utilisateur créé
   - Mot de passe : le mot de passe créé

**Format DATABASE_URL pour MySQL :**
```
mysql://username:password@localhost:3306/operiscloud_prod
```

**Alternative : PostgreSQL externe (Neon - Recommandé pour les fonctionnalités avancées)**

Si Hostinger ne supporte pas PostgreSQL ou pour de meilleures performances :
1. Créez un compte gratuit sur [Neon.tech](https://neon.tech)
2. Créez un projet "operiscloud-production"
3. Copiez la connection string PostgreSQL
4. Format : `postgresql://user:password@host/db?sslmode=require`

## Étape 2 : Configurer Clerk pour la Production

1. Connectez-vous au [dashboard Clerk](https://dashboard.clerk.com)
2. Créez une application de production ou basculez en mode production
3. Ajoutez votre domaine Hostinger dans "Allowed Origins" :
   - Exemple : `https://votredomaine.com`
   - Exemple : `https://operiscloud.votredomaine.com`
4. Configurez les URLs de redirection :
   - Sign-in URL : `https://votredomaine.com/sign-in`
   - Sign-up URL : `https://votredomaine.com/sign-up`
   - After sign-in : `https://votredomaine.com/onboarding`
   - After sign-up : `https://votredomaine.com/onboarding`
5. Notez vos clés de production :
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (commence par `pk_live_`)
   - `CLERK_SECRET_KEY` (commence par `sk_live_`)

## Étape 3 : Configurer les Variables d'Environnement

Créez un fichier `.env.production` sur votre machine locale (NE PAS committer) :

```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/operiscloud_prod"
# OU pour PostgreSQL/Neon:
# DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_VOTRE_CLE"
CLERK_SECRET_KEY="sk_live_VOTRE_SECRET"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/onboarding"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Application
NEXT_PUBLIC_APP_URL="https://votredomaine.com"
NEXT_PUBLIC_APP_DOMAIN="votredomaine.com"
NODE_ENV="production"
```

## Étape 4 : Préparer l'Application pour le Build

Sur votre machine locale :

```bash
# 1. Installer toutes les dépendances
npm install

# 2. Générer le client Prisma
npx prisma generate

# 3. Tester le build localement
npm run build

# 4. Vérifier que tout fonctionne
npm start
```

## Étape 5 : Déployer sur Hostinger

### Méthode 1 : Déploiement via Git (Recommandé)

Si Hostinger supporte le déploiement Git :

1. Dans hPanel, allez dans "Git"
2. Connectez votre repository GitHub/GitLab
3. Configurez le build :
   - Build command : `npm install && npx prisma generate && npm run build`
   - Start command : `npm start`
   - Port : `3000`
4. Ajoutez les variables d'environnement (copier depuis `.env.production`)
5. Déployez

### Méthode 2 : Déploiement Manuel via FTP/SSH

#### A. Préparer les fichiers

```bash
# Build l'application
npm run build

# Les dossiers importants à uploader :
# - .next/
# - node_modules/ (ou installer sur le serveur)
# - public/
# - prisma/
# - package.json
# - package-lock.json
```

#### B. Upload via FTP

1. Connectez-vous au FTP de Hostinger
2. Uploadez tous les fichiers dans le dossier `public_html` ou le dossier approprié
3. Uploadez le fichier `.env.production` (renommez-le en `.env` sur le serveur)

#### C. Configurer via SSH

Connectez-vous en SSH à Hostinger :

```bash
ssh votre-user@votredomaine.com

# Aller dans le dossier de l'application
cd /home/username/public_html

# Installer les dépendances (si non uploadées)
npm install --production

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations de base de données
npx prisma migrate deploy

# Démarrer l'application avec PM2 (recommandé)
npm install -g pm2
pm2 start npm --name "operiscloud" -- start
pm2 save
pm2 startup
```

## Étape 6 : Configuration du Serveur Web

### Configurer le Reverse Proxy

Dans hPanel > Configuration avancée > Node.js App ou Apache :

1. Configurez un proxy pour pointer vers le port 3000
2. Configuration Apache (.htaccess) :

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

### Configurer SSL (HTTPS)

1. Dans hPanel > Sécurité > SSL/TLS
2. Activez le certificat SSL gratuit Let's Encrypt
3. Force HTTPS dans votre domaine

## Étape 7 : Migration de la Base de Données

Une fois déployé, initialisez la base de données :

```bash
# Via SSH sur le serveur
npx prisma migrate deploy

# Vérifier que les tables sont créées
npx prisma studio
# Accessible via SSH tunnel ou configurez-le en local avec l'URL de production
```

## Étape 8 : Configuration du Domaine

### Pointer votre domaine vers Hostinger

1. Dans votre registrar de domaine (où vous avez acheté le domaine)
2. Configurez les DNS :
   - Type A : `@` → Adresse IP de Hostinger
   - Type A : `www` → Adresse IP de Hostinger
3. Attendez la propagation DNS (jusqu'à 24h)

### Vérifier la configuration

```bash
# Tester que le site est accessible
curl https://votredomaine.com

# Vérifier SSL
curl -I https://votredomaine.com
```

## Étape 9 : Monitoring et Logs

### Accéder aux logs

Via PM2 (si utilisé) :

```bash
# Voir les logs en temps réel
pm2 logs operiscloud

# Logs d'erreurs uniquement
pm2 logs operiscloud --err

# Monitoring des ressources
pm2 monit
```

Via Hostinger :
- Accédez aux logs via hPanel > Fichiers > Logs

### Monitoring de performance

Installez des outils de monitoring :

```bash
# PM2 Plus (monitoring en ligne - gratuit)
pm2 plus

# Alternative : New Relic, Datadog, etc.
```

## Maintenance

### Mettre à jour le code

```bash
# Sur le serveur via SSH
cd /home/username/public_html

# Pull les dernières modifications (si Git configuré)
git pull origin main

# Réinstaller les dépendances si nécessaire
npm install

# Rebuild
npm run build

# Redémarrer l'application
pm2 restart operiscloud
```

### Migrations de base de données

```bash
# Via SSH sur le serveur
npx prisma migrate deploy

# Vérifier le statut des migrations
npx prisma migrate status
```

### Backups

#### Base de données

```bash
# Backup MySQL
mysqldump -u username -p operiscloud_prod > backup_$(date +%Y%m%d).sql

# Restaurer un backup
mysql -u username -p operiscloud_prod < backup_20231215.sql
```

#### Fichiers de l'application

```bash
# Via SSH
tar -czf operiscloud_backup_$(date +%Y%m%d).tar.gz /home/username/public_html

# Télécharger via FTP ou SCP
```

**Recommandation** : Configurez des backups automatiques quotidiens via cron ou le panneau Hostinger.

## Sécurité Production

### Checklist Sécurité ✅

- [ ] Variables d'environnement sécurisées (`.env` non commité)
- [ ] DATABASE_URL avec credentials forts
- [ ] Clerk configuré en mode production (`pk_live_`, `sk_live_`)
- [ ] SSL/HTTPS activé via Let's Encrypt
- [ ] Fichier `.env` avec permissions restrictives (chmod 600)
- [ ] Rate limiting activé (implémenté dans l'application)
- [ ] Headers de sécurité activés (CSP, HSTS, X-Frame-Options)
- [ ] Validation stricte des uploads (images, fichiers Excel)
- [ ] Permissions utilisateurs correctement configurées
- [ ] Logs de sécurité activés et surveillés

### Mesures de Sécurité Implémentées

✅ **Rate Limiting** :
- Uploads : 10 par heure
- Imports en masse : 5 par heure
- Invitations : 20 par heure
- API standard : 100 par minute

✅ **Validation des Fichiers** :
- Logos : Max 2MB, JPG/PNG/WebP uniquement (pas de SVG pour éviter XSS)
- Imports Excel : Max 10MB, XLS/XLSX/CSV uniquement

✅ **Headers de Sécurité** (configurés dans `next.config.ts`) :
- Strict-Transport-Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Content-Security-Policy (CSP)
- X-XSS-Protection

✅ **Contrôle d'Accès** :
- Authentification via Clerk
- Permissions basées sur les rôles (OWNER, ADMIN, MANAGER, SELLER, VIEWER)
- Vérification des permissions sur chaque endpoint

### Recommandations Supplémentaires

1. **Permissions des fichiers** :
   ```bash
   chmod 600 .env  # Lecture/écriture propriétaire uniquement
   chmod 755 public_html  # Dossier accessible
   ```

2. **Configurer un pare-feu** :
   - Bloquez tous les ports sauf 80 (HTTP), 443 (HTTPS), 22 (SSH)
   - Limitez l'accès SSH par IP si possible

3. **Activer 2FA sur Clerk** :
   - Dans Clerk Dashboard > User & Authentication > Multi-factor
   - Forcez 2FA pour les rôles OWNER et ADMIN

4. **Surveiller les logs** :
   ```bash
   # Surveiller les tentatives de connexion suspectes
   tail -f /var/log/auth.log

   # Surveiller les erreurs de l'application
   pm2 logs operiscloud --err
   ```

5. **Mises à jour de sécurité** :
   ```bash
   # Mettre à jour les dépendances régulièrement
   npm audit
   npm audit fix

   # Vérifier les vulnérabilités
   npm outdated
   ```

## Performance

### Optimisations Activées

✅ **Next.js** :
- Minification et compression automatique
- Code splitting et lazy loading
- Image optimization via next/image
- Server-side rendering pour SEO
- Headers de sécurité configurés

### Optimisations Recommandées

1. **Base de données** :
   ```sql
   -- Ajouter des index sur les colonnes fréquemment requêtées
   CREATE INDEX idx_products_tenant ON products(tenantId);
   CREATE INDEX idx_orders_tenant ON orders(tenantId);
   CREATE INDEX idx_customers_tenant ON customers(tenantId);
   ```

2. **Cache** :
   - Activez le cache CDN de Hostinger pour les fichiers statiques
   - Configurez le cache navigateur pour les assets

3. **Compression** :
   ```apache
   # Dans .htaccess
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
   </IfModule>
   ```

4. **Monitoring** :
   - Utilisez PM2 monitoring pour surveiller CPU/RAM
   - Configurez des alertes si mémoire > 80%

## Coûts Estimés

### Hostinger Business Plan
- **Prix** : ~€3-10/mois (selon l'offre)
- **Inclus** :
  - Hébergement avec Node.js
  - Base de données MySQL
  - SSL gratuit
  - 100GB espace disque
  - Email professionnel

### Services Externes

**Clerk** (Authentification) :
- **Gratuit** : Jusqu'à 10,000 utilisateurs actifs mensuels (MAU)
- **Pro** : $25/mois pour plus d'utilisateurs
- **Recommandation** : Gratuit largement suffisant pour MVP

**Neon** (Base de données PostgreSQL - optionnel) :
- **Gratuit** : 0.5GB storage, largement suffisant pour démarrer
- **Pro** : $19/mois si besoin de plus

**Total estimé pour MVP** : €3-10/mois (Hostinger uniquement)

## Troubleshooting

### L'application ne démarre pas

```bash
# Vérifier les logs
pm2 logs operiscloud

# Vérifier la connexion DB
npx prisma db pull

# Vérifier les variables d'environnement
cat .env
```

### Erreurs 500

1. Vérifiez que `DATABASE_URL` est correcte
2. Vérifiez que les migrations sont appliquées : `npx prisma migrate status`
3. Vérifiez les permissions de fichiers
4. Consultez les logs : `pm2 logs operiscloud --err`

### Clerk authentication ne fonctionne pas

1. Vérifiez les clés API dans `.env` (doivent commencer par `pk_live_` et `sk_live_`)
2. Vérifiez les domaines autorisés dans Clerk Dashboard
3. Vérifiez les URLs de redirection
4. Testez la connexion : `curl https://api.clerk.com/v1/health`

### Erreurs de migration Prisma

```bash
# Réinitialiser et re-migrer
npx prisma migrate reset
npx prisma migrate deploy

# Vérifier le schéma
npx prisma validate
```

## Support & Documentation

- **Hostinger** : Support 24/7 via le panneau hPanel
- **Next.js** : https://nextjs.org/docs
- **Clerk** : https://clerk.com/docs
- **Prisma** : https://www.prisma.io/docs

## Checklist Finale de Déploiement

### Avant le Déploiement ✅

- [ ] Application testée localement (`npm run build` et `npm start`)
- [ ] Base de données créée sur Hostinger (ou Neon)
- [ ] Variables d'environnement préparées dans `.env.production`
- [ ] Clerk configuré en mode production (clés `pk_live_` et `sk_live_`)
- [ ] Domaine pointé vers Hostinger (DNS configurés)
- [ ] Code buildé sans erreurs
- [ ] Tests de sécurité effectués

### Pendant le Déploiement ✅

- [ ] Fichiers uploadés sur le serveur (via Git ou FTP)
- [ ] Dépendances installées (`npm install`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Migrations appliquées (`npx prisma migrate deploy`)
- [ ] Application démarrée avec PM2
- [ ] SSL/HTTPS activé via Let's Encrypt
- [ ] Reverse proxy configuré (port 3000)

### Après le Déploiement ✅

- [ ] Site accessible via HTTPS
- [ ] Connexion à la base de données fonctionne
- [ ] Authentification Clerk fonctionne (sign-in/sign-up)
- [ ] Toutes les pages se chargent correctement
- [ ] Uploads de fichiers fonctionnent (logos, imports)
- [ ] Génération de PDF fonctionne
- [ ] Backups automatiques configurés
- [ ] Monitoring PM2 activé
- [ ] Logs accessibles et surveillés
- [ ] Documentation de déploiement sauvegardée

### Sécurité Post-Déploiement ✅

- [ ] Rate limiting testé et fonctionnel
- [ ] Headers de sécurité vérifiés (via securityheaders.com)
- [ ] Validation des uploads testée
- [ ] Permissions utilisateurs testées
- [ ] SSL A+ grade (via ssllabs.com)
- [ ] Aucun secret dans le code source
- [ ] Fichier `.env` avec permissions 600
- [ ] 2FA activé pour les comptes admin

---

## 🎉 Votre SaaS OperisCloud est maintenant en production !

**Prochaines étapes recommandées :**

1. **Tester toutes les fonctionnalités** en conditions réelles
2. **Inviter vos premiers utilisateurs** à tester
3. **Surveiller les logs** pendant les premières semaines
4. **Configurer Google Analytics** pour suivre le trafic
5. **Mettre en place un système de feedback** utilisateur
6. **Planifier les mises à jour** et nouvelles fonctionnalités

**Support continu :**
- Vérifiez les logs quotidiennement : `pm2 logs operiscloud`
- Surveillez l'utilisation de la base de données
- Mettez à jour régulièrement les dépendances : `npm audit`
- Faites des backups avant chaque mise à jour majeure

---

**Date de dernière mise à jour** : 2025-12-23
**Version** : 1.0.0 - MVP Production Ready
**Auteur** : OperisCloud Team
