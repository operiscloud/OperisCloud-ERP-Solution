'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Trash2, ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  type: 'PHYSICAL' | 'SERVICE' | 'DIGITAL';
  categoryId: string | null;
  category: Category | null;
  price: any;
  costPrice: any;
  trackStock: boolean;
  stockQuantity: number;
  lowStockAlert: number | null;
  isActive: boolean;
  hasVariants: boolean;
  variantConfig: any;
  variants: Array<{
    id: string;
    name: string;
    sku: string | null;
    attributes: any;
    price: any;
    costPrice: any;
    stockQuantity: number;
    isActive: boolean;
  }>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: Date;
  totalQuantity: number;
  customer: {
    firstName: string;
    lastName: string | null;
  } | null;
  items: Array<{
    quantity: number;
    variantName: string | null;
  }>;
}

interface ProductEditFormProps {
  product: Product;
  orders?: Order[];
}

export default function ProductEditForm({ product, orders = [] }: ProductEditFormProps) {
  const currency = useCurrency();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    sku: product.sku || '',
    type: product.type,
    categoryId: product.categoryId || '',
    price: product.price ? Number(product.price).toString() : '0',
    costPrice: product.costPrice ? Number(product.costPrice).toString() : '',
    trackStock: product.trackStock,
    stockQuantity: product.stockQuantity.toString(),
    lowStockAlert: product.lowStockAlert?.toString() || '5',
    isActive: product.isActive,
  });

  const [variants, setVariants] = useState(
    product.variants.map(v => ({
      id: v.id,
      name: v.name,
      sku: v.sku || '',
      attributes: v.attributes,
      price: v.price ? Number(v.price).toString() : '0',
      costPrice: v.costPrice ? Number(v.costPrice).toString() : '',
      stockQuantity: v.stockQuantity.toString(),
      isActive: v.isActive,
    }))
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          lowStockAlert: formData.lowStockAlert
            ? parseInt(formData.lowStockAlert)
            : undefined,
          variants: product.hasVariants ? variants.map(v => ({
            id: v.id,
            sku: v.sku,
            price: parseFloat(v.price),
            costPrice: v.costPrice ? parseFloat(v.costPrice) : undefined,
            stockQuantity: parseInt(v.stockQuantity),
            isActive: v.isActive,
          })) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Erreur de mise à jour', data.error || 'Impossible de mettre à jour le produit');
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      toast.success('Produit mis à jour', `Le produit "${formData.name}" a été mis à jour avec succès`);
      router.push('/inventory');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer le produit');
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      toast.success('Produit supprimé', `Le produit "${product.name}" a été supprimé avec succès`);
      router.push('/inventory');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [field]: value } : v)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/inventory" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier le produit</h1>
            <p className="text-gray-600">Mettez à jour les informations du produit</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Supprimer
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="PHYSICAL">Produit physique</option>
                <option value="SERVICE">Service</option>
                <option value="DIGITAL">Produit numérique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Aucune catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Variants */}
        {product.hasVariants && variants.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Variantes ({variants.length})
            </h3>

            <div className="space-y-3">
              {variants.map((variant) => (
                <div key={variant.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{variant.name}</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) => updateVariant(variant.id, 'isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                      <input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariant(variant.id, 'stockQuantity', e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Prix de vente (CHF)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Prix de coût (CHF)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.costPrice}
                        onChange={(e) => updateVariant(variant.id, 'costPrice', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing (only for products without variants) */}
        {!product.hasVariants && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tarification</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de vente * (CHF)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de revient (CHF)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stock (only for products without variants) */}
        {!product.hasVariants && formData.type === 'PHYSICAL' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Gestion du stock</h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.trackStock}
                onChange={(e) => setFormData({ ...formData, trackStock: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Suivre le stock de ce produit
              </label>
            </div>

            {formData.trackStock && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité en stock
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alerte stock bas
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockAlert}
                    onChange={(e) =>
                      setFormData({ ...formData, lowStockAlert: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Produit actif (visible dans le catalogue)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/inventory"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>

      {/* Order History */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Historique des commandes ({orders.length})
        </h2>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/sales/${order.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Commande #{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          {' · '}
                          {order.customer
                            ? `${order.customer.firstName} ${order.customer.lastName || ''}`.trim()
                            : 'Client invité'}
                          {' · '}
                          {order.totalQuantity} unité{order.totalQuantity > 1 ? 's' : ''}
                          {order.items.length > 0 && order.items[0].variantName && (
                            <span> ({order.items.map(i => i.variantName).filter(Boolean).join(', ')})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {order.total.toFixed(2)} {currency}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        order.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status === 'CONFIRMED'
                        ? 'Confirmé'
                        : order.status === 'DRAFT'
                        ? 'Brouillon'
                        : 'Annulé'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune commande contenant ce produit</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${product.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
