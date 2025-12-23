'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { formatCurrency } from '@/lib/utils';

interface ProductVariant {
  id: string;
  price: number | null;
  stockQuantity: number;
  isActive: boolean;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stockQuantity: number;
  lowStockAlert: number | null;
  trackStock: boolean;
  isActive: boolean;
  hasVariants: boolean;
  category: ProductCategory | null;
  variants: ProductVariant[];
}

interface ProductsListProps {
  products: Product[];
  currency: string;
}

export default function ProductsList({ products, currency }: ProductsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    const name = product.name.toLowerCase();
    const sku = product.sku?.toLowerCase() || '';
    const category = product.category?.name.toLowerCase() || '';

    return (
      name.includes(searchLower) ||
      sku.includes(searchLower) ||
      category.includes(searchLower)
    );
  });

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun produit
        </h3>
        <p className="text-gray-600 mb-4">
          Commencez par ajouter votre premier produit
        </p>
        <Link
          href="/inventory/new"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un produit
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-4 border-b border-gray-200">
        <SearchBar
          placeholder="Rechercher un produit..."
          onSearch={setSearchQuery}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-600">Essayez de modifier votre recherche</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.hasVariants && (
                          <div className="text-sm text-gray-500">
                            {product.variants.length} variante(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.hasVariants && product.variants.length > 0 ? (
                      (() => {
                        const prices = product.variants
                          .map(v => v.price !== null ? v.price : product.price)
                          .filter(p => p > 0);

                        if (prices.length === 0) {
                          return formatCurrency(product.price, currency);
                        }

                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);

                        if (minPrice === maxPrice) {
                          return formatCurrency(minPrice, currency);
                        }

                        return `${formatCurrency(minPrice, currency)} - ${formatCurrency(maxPrice, currency)}`;
                      })()
                    ) : (
                      formatCurrency(product.price, currency)
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.trackStock ? (
                      (() => {
                        // Pour les produits avec variantes, calculer le stock total des variantes actives
                        const totalStock = product.hasVariants && product.variants.length > 0
                          ? product.variants
                              .filter(v => v.isActive)
                              .reduce((sum, v) => sum + v.stockQuantity, 0)
                          : product.stockQuantity;

                        const isLowStock = totalStock <= (product.lowStockAlert || 5);

                        return (
                          <span
                            className={`text-sm ${
                              isLowStock
                                ? 'text-orange-600 font-medium'
                                : 'text-gray-900'
                            }`}
                          >
                            {totalStock}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-sm text-gray-500">Non suivi</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/inventory/${product.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
