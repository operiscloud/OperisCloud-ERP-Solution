# QuickStart Guide - BusinessHub

Get BusinessHub running in 5 minutes!

## 1. Clone & Install (1 min)

```bash
# Install dependencies
npm install
```

## 2. Setup Database (2 min)

### Option A: Use Neon (Easiest - Free)

1. Go to [https://neon.tech](https://neon.tech) and create a free account
2. Create a new project called "businesshub"
3. Copy the connection string
4. Paste it in your `.env` file as `DATABASE_URL`

### Option B: Use Local PostgreSQL

```bash
# Install PostgreSQL if not already installed
brew install postgresql  # macOS
# or download from postgresql.org

# Create database
createdb businesshub

# Update .env with:
DATABASE_URL="postgresql://YOUR_USER@localhost:5432/businesshub?schema=public"
```

## 3. Setup Clerk Authentication (2 min)

1. Go to [https://clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your keys from the dashboard
4. Create `.env` file:

```env
DATABASE_URL="your-database-url-from-step-2"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=localhost
```

## 4. Initialize Database (30 sec)

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

## 5. Run the App! (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## First Steps in the App

1. **Sign Up**: Click "Commencer gratuitement" and create an account
2. **Onboarding**:
   - Select your industry (e.g., "Mode & Vêtements")
   - Enter your business name
   - Choose a subdomain
   - Click "Créer mon espace"
3. **Dashboard**: You're in! Explore the dashboard

## What's Next?

- Add your first product: Click "Ajouter un produit"
- Create a customer: Go to "Clients" → "Nouveau client"
- Make a sale: Go to "Ventes" → "Nouvelle commande"
- Track expenses: Go to "Finances" → "Nouvelle dépense"

## Troubleshooting

### "Error: Invalid Clerk Keys"
- Make sure you copied the keys correctly from Clerk dashboard
- Don't forget the `NEXT_PUBLIC_` prefix for the publishable key

### "Database connection error"
- Check your DATABASE_URL is correct
- For Neon: Make sure you copied the full connection string
- For local PostgreSQL: Make sure PostgreSQL is running

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### Still stuck?
- Run `npx prisma studio` to check if your database is set up correctly
- Check the full README.md for detailed documentation
- Make sure all environment variables are set in `.env`

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
npx prisma studio    # Open database GUI
```

## Production Deployment

Ready to deploy? Check out [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to Vercel.

---

Need help? Open an issue on GitHub or check the full README.md
