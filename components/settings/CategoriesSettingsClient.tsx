'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, AlertCircle, Package } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plan } from '@/lib/types/plans';

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count: {
    products: number;
  };
}

interface CategoriesSettingsClientProps {
  categories: Category[];
  plan: Plan;
  categoriesCount: number;
  limitPercentage: number;
}

export default function CategoriesSettingsClient({
  categories: initialCategories,
  plan,
  categoriesCount: initialCount,
  limitPercentage: initialPercentage,
}: CategoriesSettingsClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const categoriesCount = categories.length;
  const limit = plan.limits.maxCategories;
  const isUnlimited = limit === 0;
  const canAddMore = isUnlimited || categoriesCount < limit;

  const handleCreate = () => {
    if (!canAddMore) {
      toast.error(
        'Limite atteinte',
        `Vous avez atteint la limite de ${limit} catégories pour le plan ${plan.name}. Passez à un plan supérieur pour créer plus de catégories.`
      );
      return;
    }
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowDialog(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowDialog(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer la catégorie');
        throw new Error(data.error);
      }

      toast.success(
        'Catégorie supprimée',
        `La catégorie "${categoryToDelete.name}" a été supprimée avec succès`
      );

      setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
      router.refresh();
    } catch (err) {
      // Error already shown in toast
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(
          editingCategory ? 'Erreur de modification' : 'Erreur de création',
          data.error || 'Une erreur est survenue'
        );
        throw new Error(data.error);
      }

      const { category } = await response.json();

      toast.success(
        editingCategory ? 'Catégorie modifiée' : 'Catégorie créée',
        `La catégorie "${formData.name}" a été ${editingCategory ? 'modifiée' : 'créée'} avec succès`
      );

      if (editingCategory) {
        setCategories(
          categories.map((c) =>
            c.id === category.id ? { ...c, name: category.name, description: category.description } : c
          )
        );
      } else {
        setCategories([...categories, { ...category, _count: { products: 0 } }]);
      }

      setShowDialog(false);
      router.refresh();
    } catch (err) {
      // Error already shown in toast
    } finally {
      setSaving(false);
    }
  };

  const limitPercentage = isUnlimited ? 0 : (categoriesCount / limit) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories de produits</h1>
          <p className="text-gray-600 mt-1">Organisez vos produits par catégories</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={!canAddMore}
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Plan Limit Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Limite de catégories</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {isUnlimited ? (
                'Illimité'
              ) : (
                <>
                  {categoriesCount} / {limit}
                </>
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">Plan {plan.name}</p>
          </div>
          {!canAddMore && (
            <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Limite atteinte</span>
            </div>
          )}
        </div>

        {!isUnlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                limitPercentage >= 100
                  ? 'bg-red-600'
                  : limitPercentage >= 80
                  ? 'bg-amber-600'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(limitPercentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Aucune catégorie créée</p>
            <button
              onClick={handleCreate}
              disabled={!canAddMore}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer votre première catégorie
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produits
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {category.description || <span className="italic">Aucune description</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-1" />
                      {category._count.products}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex: Électronique, Vêtements, etc."
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
                  placeholder="Description optionnelle de la catégorie..."
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la catégorie"
        message={
          categoryToDelete
            ? `Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete.name}" ?${
                categoryToDelete._count.products > 0
                  ? ` Cette catégorie contient ${categoryToDelete._count.products} produit${
                      categoryToDelete._count.products > 1 ? 's' : ''
                    }.`
                  : ''
              }`
            : ''
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
