'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X, Lock } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';
import UpgradeModal from '@/components/paywall/UpgradeModal';

interface VariantOption {
  name: string;
  values: string[];
}

interface VariantCombination {
  id: string;
  attributes: { [key: string]: string };
  sku: string;
  price: string;
  costPrice: string;
  stockQuantity: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface NewProductClientProps {
  hasVariantsAccess: boolean;
  plan: 'FREE' | 'PRO' | 'BUSINESS';
}

export default function NewProductClient({ hasVariantsAccess, plan }: NewProductClientProps) {
  const router = useRouter();
  const currency = useCurrency();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableVariantOptions, setAvailableVariantOptions] = useState<VariantOption[]>([]);
  const [selectedVariantOptions, setSelectedVariantOptions] = useState<string[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<VariantCombination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    type: 'PHYSICAL' as 'PHYSICAL' | 'SERVICE' | 'DIGITAL',
    categoryId: '',
    price: '',
    costPrice: '',
    trackStock: true,
    stockQuantity: '0',
    lowStockAlert: '5',
    isActive: true,
    hasVariants: false,
  });

  useEffect(() => {
    loadVariantOptions();
    loadCategories();
  }, []);

  const loadVariantOptions = async () => {
    try {
      const response = await fetch('/api/settings/variant-options');
      if (response.ok) {
        const data = await response.json();
        setAvailableVariantOptions(data.variantOptions || []);
      }
    } catch (err) {
      console.error('Failed to load variant options:', err);
    }
  };

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

  const toggleVariantOption = (optionName: string) => {
    if (selectedVariantOptions.includes(optionName)) {
      setSelectedVariantOptions(selectedVariantOptions.filter(o => o !== optionName));
    } else {
      setSelectedVariantOptions([...selectedVariantOptions, optionName]);
    }
    // Reset combinations when options change
    setVariantCombinations([]);
  };

  const generateVariantCombinations = () => {
    if (selectedVariantOptions.length === 0) return;

    const selectedOptions = availableVariantOptions.filter(opt =>
      selectedVariantOptions.includes(opt.name)
    );

    // Generate all combinations
    const combinations: VariantCombination[] = [];
    const generate = (index: number, current: { [key: string]: string }) => {
      if (index === selectedOptions.length) {
        const id = Object.values(current).join('-').toLowerCase().replace(/\s+/g, '-');
        const skuSuffix = Object.values(current).map(v => v.substring(0, 2).toUpperCase()).join('-');

        combinations.push({
          id,
          attributes: { ...current },
          sku: formData.sku ? `${formData.sku}-${skuSuffix}` : skuSuffix,
          price: formData.price,
          costPrice: formData.costPrice,
          stockQuantity: formData.stockQuantity,
          isActive: true,
        });
        return;
      }

      const option = selectedOptions[index];
      for (const value of option.values) {
        generate(index + 1, { ...current, [option.name]: value });
      }
    };

    generate(0, {});
    setVariantCombinations(combinations);
  };

  const updateVariantCombination = (id: string, field: string, value: any) => {
    setVariantCombinations(
      variantCombinations.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseData = {
        ...formData,
        categoryId: formData.categoryId || undefined,
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockAlert: formData.lowStockAlert
          ? parseInt(formData.lowStockAlert)
          : undefined,
        images: [],
      };

      if (formData.hasVariants && variantCombinations.length > 0) {
        // Create product with variants
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...baseData,
            hasVariants: true,
            variantConfig: {
              options: selectedVariantOptions,
            },
            variants: variantCombinations.map(v => ({
              name: Object.values(v.attributes).join(' / '),
              sku: v.sku,
              attributes: v.attributes,
              price: parseFloat(v.price),
              costPrice: v.costPrice ? parseFloat(v.costPrice) : undefined,
              stockQuantity: parseInt(v.stockQuantity),
              isActive: v.isActive,
              images: [],
            })),
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la création');
        }
      } else {
        // Create simple product without variants
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...baseData,
            hasVariants: false,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la création');
        }
      }

      router.push('/inventory');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/inventory"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau produit</h1>
          <p className="text-gray-600">Ajoutez un nouveau produit à votre catalogue</p>
        </div>
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
              placeholder="Ex: T-Shirt Basic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Description du produit..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex: TSH-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="PHYSICAL">Produit physique</option>
                <option value="SERVICE">Service</option>
                <option value="DIGITAL">Produit numérique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
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

        {/* Variants Toggle */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Variantes</h3>
              <p className="text-sm text-gray-600">
                Ce produit a plusieurs variantes (taille, couleur, etc.)
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!hasVariantsAccess && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  PRO
                </span>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasVariants}
                  onChange={(e) => {
                    if (!hasVariantsAccess) {
                      setShowUpgradeModal(true);
                      return;
                    }
                    setFormData({ ...formData, hasVariants: e.target.checked });
                    if (!e.target.checked) {
                      setSelectedVariantOptions([]);
                      setVariantCombinations([]);
                    }
                  }}
                  disabled={!hasVariantsAccess}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 ${!hasVariantsAccess ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
              </label>
            </div>
          </div>

          {formData.hasVariants && (
            <div className="space-y-4 pt-4 border-t">
              {availableVariantOptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">Aucune option de variante configurée</p>
                  <Link
                    href="/settings/variants"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Configurer les options de variantes →
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionnez les options de variantes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableVariantOptions.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => toggleVariantOption(option.name)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedVariantOptions.includes(option.name)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedVariantOptions.length > 0 && (
                    <button
                      type="button"
                      onClick={generateVariantCombinations}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Générer les combinaisons
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Variant Combinations */}
        {formData.hasVariants && variantCombinations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Combinaisons de variantes ({variantCombinations.length})
            </h3>

            <div className="space-y-3">
              {variantCombinations.map((variant) => (
                <div
                  key={variant.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {Object.entries(variant.attributes)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' • ')}
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) =>
                          updateVariantCombination(variant.id, 'isActive', e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariantCombination(variant.id, 'sku', e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariantCombination(variant.id, 'stockQuantity', e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Prix de vente ({currency})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantCombination(variant.id, 'price', e.target.value)
                        }
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Prix de coût ({currency})
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.costPrice}
                        onChange={(e) =>
                          updateVariantCombination(variant.id, 'costPrice', e.target.value)
                        }
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
        {!formData.hasVariants && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tarification</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de vente * ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="29.90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de revient ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="15.00"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stock (only for products without variants) */}
        {!formData.hasVariants && formData.type === 'PHYSICAL' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Gestion du stock</h3>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.trackStock}
                onChange={(e) =>
                  setFormData({ ...formData, trackStock: e.target.checked })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
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
            {loading ? 'Création...' : 'Créer le produit'}
          </button>
        </div>
      </form>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Variantes de produits"
        featureDescription="Gérez plusieurs versions d'un produit avec différentes tailles, couleurs, ou autres attributs. Chaque variante a son propre stock et prix."
        currentPlan={plan}
        suggestedPlan="PRO"
      />
    </div>
  );
}
