import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Package } from 'lucide-react';
import NewProductButton from '@/components/inventory/NewProductButton';
import UsageIndicator from '@/components/paywall/UsageIndicator';
import ProductsList from '@/components/inventory/ProductsList';

export default async function InventoryPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true } } },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const products = await prisma.product.findMany({
    where: { tenantId: user.tenantId },
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Convert Decimal to number for client components
  const productsForClient = products.map(product => ({
    ...product,
    price: Number(product.price),
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    variants: product.variants.map(variant => ({
      id: variant.id,
      price: variant.price ? Number(variant.price) : null,
      costPrice: variant.costPrice ? Number(variant.costPrice) : null,
      stockQuantity: variant.stockQuantity,
      isActive: variant.isActive,
    })),
  }));

  const lowStockCount = products.filter((p) => {
    if (!p.trackStock) return false;

    // Pour les produits avec variantes, vérifier le stock total des variantes actives
    if (p.hasVariants && p.variants.length > 0) {
      const totalStock = p.variants
        .filter(v => v.isActive)
        .reduce((sum, v) => sum + v.stockQuantity, 0);
      return totalStock <= (p.lowStockAlert || 5);
    }

    // Pour les produits sans variantes, vérifier le stock du produit
    return p.stockQuantity <= (p.lowStockAlert || 5);
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-600">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <NewProductButton />
      </div>

      {/* Usage Indicator */}
      <UsageIndicator limitType="products" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total produits</p>
              <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits actifs</p>
              <p className="text-3xl font-bold text-gray-900">
                {products.filter((p) => p.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock bas</p>
              <p className="text-3xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow">
        <ProductsList products={productsForClient} currency={user.tenant.currency} />
      </div>
    </div>
  );
}
