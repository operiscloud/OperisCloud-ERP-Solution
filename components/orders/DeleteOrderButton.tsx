'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface DeleteOrderButtonProps {
  orderId: string;
  orderNumber: string;
}

export default function DeleteOrderButton({ orderId, orderNumber }: DeleteOrderButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer la commande');
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      toast.success('Commande supprimée', `La commande #${orderNumber} a été supprimée avec succès`);
      router.push('/sales');
      router.refresh();
    } catch (err: any) {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Supprimer
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Supprimer la commande"
        message={`Êtes-vous sûr de vouloir supprimer la commande #${orderNumber} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </>
  );
}
