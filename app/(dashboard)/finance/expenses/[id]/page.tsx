'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Expense {
  id: string;
  title: string;
  description: string | null;
  amount: any;
  category: string;
  date: string;
  paymentMethod: string | null;
}

export default function ExpenseEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const currency = useCurrency();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [expense, setExpense] = useState<Expense | null>(null);
  const [expenseId, setExpenseId] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'PRODUCTION',
    date: '',
    paymentMethod: 'CASH',
  });

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params;
      setExpenseId(resolvedParams.id);
      loadExpense(resolvedParams.id);
    }
    initializeParams();
  }, [params]);

  const loadExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`);
      if (response.ok) {
        const data = await response.json();
        setExpense(data.expense);

        // Format date for input[type="date"]
        const date = new Date(data.expense.date);
        const formattedDate = date.toISOString().split('T')[0];

        setFormData({
          title: data.expense.title,
          description: data.expense.description || '',
          amount: Number(data.expense.amount).toString(),
          category: data.expense.category,
          date: formattedDate,
          paymentMethod: data.expense.paymentMethod || 'CASH',
        });
      } else {
        setError('Dépense non trouvée');
      }
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de mise à jour', data.error || 'Impossible de mettre à jour la dépense');
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      toast.success('Dépense mise à jour', `La dépense "${formData.title}" a été mise à jour avec succès`);
      router.push('/finance');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer la dépense');
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      toast.success('Dépense supprimée', `La dépense "${expense?.title}" a été supprimée avec succès`);
      router.push('/finance');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Dépense non trouvée</p>
        <Link href="/finance" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/finance" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier la dépense</h1>
            <p className="text-gray-600">Mettez à jour les informations de la dépense</p>
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ex: Achat matériel"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Détails de la dépense..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Montant * ({currency})</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="150.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="PRODUCTION">Production</option>
              <option value="MARKETING">Marketing</option>
              <option value="LOYER">Loyer</option>
              <option value="SALAIRES">Salaires</option>
              <option value="FOURNITURES">Fournitures</option>
              <option value="TRANSPORT">Transport</option>
              <option value="UTILITIES">Services publics</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de paiement</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="CASH">Espèces</option>
              <option value="CARD">Carte bancaire</option>
              <option value="TRANSFER">Virement</option>
              <option value="CHECK">Chèque</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Link
            href="/finance"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer la dépense"
        message={`Êtes-vous sûr de vouloir supprimer la dépense "${expense?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
