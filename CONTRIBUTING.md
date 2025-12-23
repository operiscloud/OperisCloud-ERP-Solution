# Contributing to BusinessHub

Merci de votre intérêt pour contribuer à BusinessHub ! Ce document fournit les directives pour contribuer au projet.

## 🚀 Pour Commencer

### Prérequis

- Node.js 18+
- PostgreSQL (local ou cloud)
- Compte Clerk pour l'authentification
- Git

### Setup

1. Forkez le repository
2. Clonez votre fork
   ```bash
   git clone https://github.com/VOTRE-USERNAME/businesshub.git
   cd businesshub
   ```
3. Installez les dépendances
   ```bash
   npm install
   ```
4. Configurez votre `.env` (voir `.env.example`)
5. Setup la base de données
   ```bash
   npx prisma generate
   npx prisma db push
   ```
6. Lancez le serveur de développement
   ```bash
   npm run dev
   ```

## 📋 Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'est pas déjà signalé dans les [Issues](https://github.com/votreusername/businesshub/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du bug
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Informations sur votre environnement (OS, navigateur, version Node)

### Proposer une Fonctionnalité

1. Vérifiez dans les [Issues](https://github.com/votreusername/businesshub/issues) et [TODO.md](./TODO.md)
2. Créez une issue avec le template "Feature Request"
3. Décrivez :
   - Le problème que ça résout
   - La solution proposée
   - Des alternatives considérées

### Soumettre du Code

#### Workflow Git

1. Créez une branche depuis `main`
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   # ou
   git checkout -b fix/correction-bug
   ```

2. Faites vos modifications

3. Commitez avec des messages clairs (voir [Conventions](#conventions-de-commit))
   ```bash
   git commit -m "feat: ajoute la fonctionnalité X"
   ```

4. Pushez vers votre fork
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

5. Créez une Pull Request

#### Pull Request Guidelines

- **Titre clair** : Résumez le changement en une ligne
- **Description détaillée** :
  - Quel problème ça résout
  - Comment ça le résout
  - Tests effectués
  - Screenshots si UI
- **Lien vers l'issue** : Closes #123
- **Tests** : Assurez-vous que les tests passent
- **Code review** : Soyez ouvert aux retours

### Conventions de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description>

[body optionnel]

[footer optionnel]
```

**Types** :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, point-virgules manquants, etc.
- `refactor`: Refactoring de code
- `perf`: Amélioration de performance
- `test`: Ajout de tests
- `chore`: Maintenance, dépendances, etc.

**Exemples** :
```bash
feat(inventory): ajoute l'import CSV de produits
fix(dashboard): corrige le calcul du CA mensuel
docs: met à jour le README avec les nouvelles features
refactor(api): simplifie la logique de création de tenant
```

## 🏗️ Structure du Code

### Organisation

```
businesshub/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Pages publiques (auth)
│   ├── (dashboard)/       # Pages protégées (app)
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── dashboard/        # Composants spécifiques dashboard
│   ├── forms/           # Formulaires réutilisables
│   ├── layout/          # Layout components (Nav, Header)
│   └── ui/              # Composants UI de base
├── lib/                  # Utilitaires et helpers
│   ├── prisma.ts        # Client Prisma
│   ├── tenant.ts        # Logique multi-tenant
│   ├── validations.ts   # Schémas Zod
│   └── utils.ts         # Helpers généraux
├── prisma/
│   └── schema.prisma    # Schéma de base de données
└── types/
    └── index.ts         # Types TypeScript
```

### Standards de Code

#### TypeScript

- **Strict mode** activé
- **Types explicites** pour les paramètres de fonction
- **Interfaces** pour les objets
- **Enums** pour les constantes fixes

```typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
  role: UserRole;
}

function getUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

// ❌ Mauvais
function getUser(id) {
  return prisma.user.findUnique({ where: { id } });
}
```

#### React Components

- **Functional components** avec hooks
- **TypeScript props** avec interface
- **Server Components** par défaut (Next.js 14)
- **'use client'** seulement si nécessaire

```tsx
// ✅ Bon - Server Component
interface ProductCardProps {
  product: Product;
  currency: string;
}

export function ProductCard({ product, currency }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatCurrency(product.price, currency)}</p>
    </div>
  );
}

// ✅ Bon - Client Component (si interactivité)
'use client';

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [name, setName] = useState('');
  // ...
}
```

#### Naming Conventions

- **Components** : PascalCase (`ProductCard`, `UserProfile`)
- **Files** : kebab-case pour pages (`user-profile.tsx`), PascalCase pour composants
- **Functions** : camelCase (`getUserById`, `calculateTotal`)
- **Constants** : SCREAMING_SNAKE_CASE (`MAX_ITEMS`, `DEFAULT_CURRENCY`)
- **Interfaces/Types** : PascalCase (`UserRole`, `OrderStatus`)

#### Styling

- **TailwindCSS** uniquement (pas de CSS custom sauf nécessaire)
- **Utility-first** approach
- **Composants réutilisables** avec variants via `clsx` et `tailwind-merge`

```tsx
// ✅ Bon
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Click me
</button>

// ❌ Mauvais (éviter inline styles)
<button style={{ backgroundColor: 'blue', padding: '8px 16px' }}>
  Click me
</button>
```

### API Routes

- **Validation** avec Zod
- **Error handling** standardisé
- **Types de retour** explicites
- **Tenant isolation** sur toutes les requêtes

```typescript
// ✅ Bon
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const products = await prisma.product.findMany({
      where: { tenantId },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
```

### Database (Prisma)

- **Toujours inclure tenantId** dans les modèles (sauf Tenant et User)
- **Indexes** sur les champs fréquemment requêtés
- **Relations** explicites
- **Noms en anglais** pour cohérence

```prisma
// ✅ Bon
model Product {
  id        String   @id @default(cuid())
  name      String
  price     Decimal  @db.Decimal(10, 2)

  // Tenant isolation
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([tenantId])
  @@index([name])
}
```

## 🧪 Tests

### Lancer les Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

### Écrire des Tests

- Tests unitaires pour les fonctions utilitaires
- Tests d'intégration pour les API routes
- Tests E2E pour les flows critiques (onboarding, création commande)

```typescript
// Exemple de test
describe('formatCurrency', () => {
  it('formate correctement en CHF', () => {
    expect(formatCurrency(29.99, 'CHF')).toBe('CHF 29.99');
  });

  it('gère les montants négatifs', () => {
    expect(formatCurrency(-10, 'EUR')).toBe('-€10.00');
  });
});
```

## 📚 Documentation

### Code Comments

- **Commentaires** seulement pour logique complexe
- **JSDoc** pour les fonctions publiques/utilitaires

```typescript
/**
 * Calcule le total d'une commande avec TVA et réductions
 * @param items - Articles de la commande
 * @param taxRate - Taux de TVA en pourcentage (ex: 8.1)
 * @param discount - Montant de réduction
 * @returns Total calculé
 */
export function calculateOrderTotal(
  items: OrderItem[],
  taxRate: number,
  discount: number = 0
): number {
  // Implementation
}
```

### README Updates

Si vous ajoutez une fonctionnalité majeure, mettez à jour :
- README.md
- FEATURES.md
- TODO.md
- CHANGELOG.md

## 🔒 Sécurité

### Signaler une Vulnérabilité

**NE CRÉEZ PAS D'ISSUE PUBLIQUE** pour les vulnérabilités de sécurité.

Envoyez un email à : [security@votreentreprise.com]

Incluez :
- Description de la vulnérabilité
- Étapes pour reproduire
- Impact potentiel
- Suggestions de correction

### Checklist Sécurité

- [ ] Pas de secrets dans le code
- [ ] Validation de tous les inputs
- [ ] Isolation tenant vérifiée
- [ ] Permissions vérifiées
- [ ] XSS prévenu
- [ ] SQL injection impossible (Prisma)

## 📞 Besoin d'Aide ?

- **Questions** : Créez une [Discussion](https://github.com/votreusername/businesshub/discussions)
- **Bugs** : Créez une [Issue](https://github.com/votreusername/businesshub/issues)
- **Chat** : Rejoignez notre [Discord](#) (bientôt)

## 📜 Code of Conduct

- Soyez respectueux et inclusif
- Pas de harcèlement ou discrimination
- Contributions constructives uniquement
- Respectez les opinions divergentes

## 📄 Licence

En contribuant à BusinessHub, vous acceptez que vos contributions soient sous la même licence que le projet.

---

Merci de contribuer à BusinessHub ! 🙏
