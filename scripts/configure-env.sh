#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Configuration de BusinessHub - Variables d'Environnement   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  Un fichier .env existe déjà."
    read -p "Voulez-vous le remplacer ? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Configuration annulée."
        exit 0
    fi
fi

echo "📋 Suivez les instructions ci-dessous pour obtenir vos clés..."
echo ""

# Neon Database URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  BASE DE DONNÉES (Neon)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Allez sur : https://neon.tech"
echo "   1. Créez un compte gratuit"
echo "   2. Créez un projet 'businesshub'"
echo "   3. Copiez la 'Connection String'"
echo ""
read -p "   Collez votre DATABASE_URL ici : " DATABASE_URL
echo ""

# Clerk Keys
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  AUTHENTIFICATION (Clerk)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Allez sur : https://clerk.com"
echo "   1. Créez un compte gratuit"
echo "   2. Créez une application 'BusinessHub'"
echo "   3. Copiez les deux clés API"
echo ""
read -p "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (pk_test_...) : " CLERK_PUB_KEY
echo ""
read -p "   CLERK_SECRET_KEY (sk_test_...) : " CLERK_SECRET_KEY
echo ""

# Create .env file
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Création du fichier .env..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > .env << EOF
# Database Configuration
DATABASE_URL="$DATABASE_URL"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUB_KEY
CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=localhost
EOF

echo "✅ Fichier .env créé avec succès !"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Prochaines étapes :"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   1. Initialiser la base de données :"
echo "      npm run db:push"
echo ""
echo "   2. Lancer l'application :"
echo "      npm run dev"
echo ""
echo "   3. Ouvrir dans le navigateur :"
echo "      http://localhost:3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
