'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlanLimit } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';

interface InviteUserFormProps {
  tenantId: string;
  currentUsersCount: number;
}

export default function InviteUserForm({ tenantId, currentUsersCount }: InviteUserFormProps) {
  const router = useRouter();
  const { canCreate, requiresUpgrade, plan, limit } = usePlanLimit('users');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'MANAGER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if limit is reached
    if (requiresUpgrade) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          tenantId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }

      alert('Invitation envoyée avec succès!');
      setFormData({ email: '', role: 'MANAGER' });
      router.refresh();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      alert(error.message || 'Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Usage indicator */}
      {limit > 0 && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Utilisateurs actifs: {currentUsersCount} / {limit}</span>
            {currentUsersCount >= limit && (
              <span className="text-red-600 font-medium">Limite atteinte</span>
            )}
          </div>
          {limit > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  currentUsersCount >= limit ? 'bg-red-600' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, (currentUsersCount / limit) * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="utilisateur@exemple.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rôle
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SELLER">Vendeur</option>
            <option value="VIEWER">Lecture seule</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || requiresUpgrade}
        className={`px-6 py-2 rounded-lg font-medium ${
          requiresUpgrade
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
        }`}
      >
        {requiresUpgrade
          ? 'Limite atteinte - Passez à Pro'
          : loading
          ? 'Envoi...'
          : 'Envoyer l\'invitation'}
      </button>
    </form>

    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      feature="Utilisateurs supplémentaires"
      featureDescription={`Vous avez atteint la limite de ${limit} utilisateur${limit > 1 ? 's' : ''} du plan ${plan}. Passez à un plan supérieur pour inviter plus de membres dans votre équipe.`}
      currentPlan={plan}
      suggestedPlan="PRO"
    />
    </>
  );
}
