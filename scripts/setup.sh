#!/bin/bash

# BusinessHub Setup Script
# This script helps you set up BusinessHub quickly

echo "🚀 BusinessHub Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    echo "📝 Creating .env from .env.example..."

    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file"
        echo ""
        echo "⚠️  IMPORTANT: You need to configure your .env file with:"
        echo "   1. DATABASE_URL (from Neon or your PostgreSQL)"
        echo "   2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from Clerk)"
        echo "   3. CLERK_SECRET_KEY (from Clerk)"
        echo ""
        echo "📖 Follow the QUICKSTART.md guide for details"
        echo ""

        read -p "Press Enter when you've configured .env file..."
    else
        echo "❌ .env.example not found. Creating basic .env..."
        cat > .env << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/businesshub?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=localhost
EOF
        echo "✅ Created basic .env file"
        echo "⚠️  Please edit .env and add your credentials"
        exit 0
    fi
fi

# Check if DATABASE_URL is configured
if grep -q "postgresql://user:password@localhost" .env; then
    echo "⚠️  DATABASE_URL is not configured properly"
    echo ""
    echo "Quick setup options:"
    echo "  1. Use Neon (cloud, free): https://neon.tech"
    echo "  2. Use local PostgreSQL"
    echo ""
    echo "After configuring DATABASE_URL in .env, run this script again."
    exit 0
fi

# Check if Clerk keys are configured
if grep -q "pk_test_xxx" .env || grep -q "sk_test_xxx" .env; then
    echo "⚠️  Clerk keys are not configured"
    echo ""
    echo "Get your Clerk keys from: https://clerk.com"
    echo "Then update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env"
    echo ""
    echo "After configuring Clerk, run this script again."
    exit 0
fi

echo "✅ .env file is configured"
echo ""

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Push schema to database
echo "📊 Setting up database..."
echo "   This will create all tables in your database"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push

    if [ $? -ne 0 ]; then
        echo "❌ Failed to setup database"
        echo "   Please check your DATABASE_URL in .env"
        exit 1
    fi

    echo "✅ Database setup complete"
    echo ""
fi

# All done!
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Sign up and create your first tenant"
echo ""
echo "📖 See QUICKSTART.md for more information"
echo ""
