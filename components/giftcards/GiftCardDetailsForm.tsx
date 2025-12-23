'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Trash2, Gift, Calendar, CreditCard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface Order {
  id: string;
  orderNumber: string;
  giftCardAmount: number;
  createdAt: Date;
  customer: {
    firstName: string;
    lastName: string | null;
  } | null;
}

interface GiftCard {
  id: string;
  code: string;
  initialAmount: number;
  balance: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  usedAt: Date | null;
  orders: Order[];
}

interface GiftCardDetailsFormProps {
  giftCard: GiftCard;
}

export default function GiftCardDetailsForm({ giftCard }: GiftCardDetailsFormProps) {
  const currency = useCurrency();
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const isExpired = giftCard.expiresAt && new Date(giftCard.expiresAt) <= new Date();
  const isUsed = giftCard.balance === 0;
  const usagePercentage = ((giftCard.initialAmount - giftCard.balance) / giftCard.initialAmount) * 100;

  const handleToggleActive = async () => {
    setToggling(true);
    setError('');

    try {
      const response = await fetch(`/api/giftcards/${giftCard.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !giftCard.isActive }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de modification', data.error || 'Impossible de modifier le bon cadeau');
        throw new Error(data.error || 'Erreur lors de la modification');
      }

      toast.success(
        giftCard.isActive ? 'Bon cadeau désactivé' : 'Bon cadeau activé',
        `Le bon cadeau #${giftCard.code} a été ${giftCard.isActive ? 'désactivé' : 'activé'} avec succès`
      );
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/giftcards/${giftCard.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer le bon cadeau');
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      toast.success('Bon cadeau supprimé', `Le bon cadeau #${giftCard.code} a été supprimé avec succès`);
      router.push('/giftcards');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/giftcards"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux bons cadeaux
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bon cadeau #{giftCard.code}</h1>
            <p className="text-gray-600">
              Créé le {new Date(giftCard.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleToggleActive}
              disabled={toggling || isExpired}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {toggling ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : giftCard.isActive ? (
                'Désactiver'
              ) : (
                'Activer'
              )}
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Status Banner */}
      {isExpired && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Ce bon cadeau a expiré le {new Date(giftCard.expiresAt!).toLocaleDateString('fr-FR')}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Montant initial</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {giftCard.initialAmount.toFixed(2)} {currency}
              </p>
            </div>
            <Gift className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Solde restant</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {giftCard.balance.toFixed(2)} {currency}
              </p>
            </div>
            <CreditCard className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {isExpired ? 'Expiré' : isUsed ? 'Utilisé' : giftCard.isActive ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <div
              className={`h-10 w-10 rounded-full ${
                isExpired
                  ? 'bg-red-100'
                  : isUsed
                  ? 'bg-gray-100'
                  : giftCard.isActive
                  ? 'bg-green-100'
                  : 'bg-yellow-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Utilisation</h2>
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Montant utilisé</span>
            <span>
              {(giftCard.initialAmount - giftCard.balance).toFixed(2)} {currency} ({usagePercentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Informations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Code</p>
            <p className="text-base font-medium text-gray-900">{giftCard.code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date d'expiration</p>
            <p className="text-base font-medium text-gray-900">
              {giftCard.expiresAt
                ? new Date(giftCard.expiresAt).toLocaleDateString('fr-FR')
                : 'Pas d\'expiration'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Première utilisation</p>
            <p className="text-base font-medium text-gray-900">
              {giftCard.usedAt
                ? new Date(giftCard.usedAt).toLocaleDateString('fr-FR')
                : 'Jamais utilisé'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nombre d'utilisations</p>
            <p className="text-base font-medium text-gray-900">{giftCard.orders.length}</p>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Historique des utilisations ({giftCard.orders.length})
        </h2>

        {giftCard.orders.length > 0 ? (
          <div className="space-y-3">
            {giftCard.orders.map((order) => (
              <Link
                key={order.id}
                href={`/sales/${order.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      -{order.giftCardAmount.toFixed(2)} {currency}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune utilisation pour le moment</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Supprimer le bon cadeau"
        message={`Êtes-vous sûr de vouloir supprimer le bon cadeau #${giftCard.code} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
