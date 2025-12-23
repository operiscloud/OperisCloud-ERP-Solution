'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, TrendingUp, Edit, Trash2, Lock, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Segment {
  id: string;
  name: string;
  description: string | null;
  color: string;
  customerCount: number;
  criteria: any;
  createdAt: string;
}

interface SegmentsPageClientProps {
  hasAccess: boolean;
}

export default function SegmentsPageClient({ hasAccess }: SegmentsPageClientProps) {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (hasAccess) {
      loadSegments();
    } else {
      setLoading(false);
    }
  }, [hasAccess]);

  const loadSegments = async () => {
    try {
      const response = await fetch('/api/segments');
      if (response.ok) {
        const data = await response.json();
        setSegments(data.segments || []);
      } else {
        toast.error('Erreur de chargement', 'Impossible de charger les segments');
      }
    } catch (error) {
      console.error('Error loading segments:', error);
      toast.error('Erreur de chargement', 'Une erreur est survenue lors du chargement des segments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (segment: Segment) => {
    setSegmentToDelete(segment);
    setDeleteDialogOpen(true);
  };

  const deleteSegment = async () => {
    if (!segmentToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/segments/${segmentToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSegments(segments.filter(s => s.id !== segmentToDelete.id));
        toast.success('Segment supprimé', `Le segment "${segmentToDelete.name}" a été supprimé avec succès`);
        setDeleteDialogOpen(false);
        setSegmentToDelete(null);
      } else {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer le segment');
      }
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast.error('Erreur de suppression', 'Une erreur est survenue lors de la suppression du segment');
    } finally {
      setDeleting(false);
    }
  };

  const recalculateSegments = async () => {
    if (!confirm('Recalculer tous les segments? Cela recalculera les statistiques des clients et réassignera tous les clients aux segments correspondants.')) return;

    setRecalculating(true);
    try {
      // First, recalculate customer statistics
      console.log('[Segments] Recalculating customer statistics...');
      const statsResponse = await fetch('/api/customers/recalculate-stats', {
        method: 'POST',
      });

      if (!statsResponse.ok) {
        toast.error('Erreur de recalcul', 'Impossible de recalculer les statistiques clients');
        return;
      }

      console.log('[Segments] Customer stats recalculated, now recalculating segments...');

      // Then recalculate segments
      const segmentsResponse = await fetch('/api/segments/recalculate', {
        method: 'POST',
      });

      if (segmentsResponse.ok) {
        toast.success('Recalcul terminé', 'Les statistiques clients et segments ont été recalculés avec succès');
        loadSegments();
      } else {
        toast.error('Erreur de recalcul', 'Impossible de recalculer les segments');
      }
    } catch (error) {
      console.error('Error recalculating segments:', error);
      toast.error('Erreur de recalcul', 'Une erreur est survenue lors du recalcul des segments');
    } finally {
      setRecalculating(false);
    }
  };

  // Paywall for users without access
  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-12 text-center">
          <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-indigo-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Segmentation Clients
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Créez des segments de clients basés sur leur comportement d'achat, leur localisation, ou leurs préférences pour mieux cibler vos campagnes marketing.
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Avec la segmentation vous pouvez:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Créer des segments personnalisés
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Filtrer par montant dépensé, nombre de commandes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Cibler vos campagnes marketing
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Analyser vos meilleurs clients
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Identifier les clients à risque
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Débloquer avec Business - 79 CHF/mois
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            Essai gratuit 14 jours • Aucune carte requise
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Segments de clients</h1>
          <p className="text-gray-600">
            Organisez vos clients en segments pour mieux cibler vos actions marketing
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={recalculateSegments}
            disabled={recalculating}
            className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title="Recalculer tous les segments"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${recalculating ? 'animate-spin' : ''}`} />
            Recalculer
          </button>
          <Link
            href="/crm/segments/new"
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau segment
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Segments actifs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{segments.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total clients segmentés</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {segments.reduce((sum, s) => sum + s.customerCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Segment le plus grand</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {segments.length > 0
                  ? Math.max(...segments.map(s => s.customerCount))
                  : 0} clients
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Segments List */}
      <div className="bg-white rounded-lg shadow">
        {segments.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun segment</h3>
            <p className="text-gray-600 mb-4">
              Créez votre premier segment pour organiser vos clients
            </p>
            <Link
              href="/crm/segments/new"
              className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer un segment
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {segments.map((segment) => (
              <div key={segment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: segment.color }}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {segment.name}
                      </h3>
                      {segment.description && (
                        <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          {segment.customerCount} client{segment.customerCount > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-gray-400">
                          Créé le {new Date(segment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/crm?segment=${segment.id}`}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Voir les clients"
                    >
                      <Users className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/crm/segments/${segment.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(segment)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSegmentToDelete(null);
        }}
        onConfirm={deleteSegment}
        title="Supprimer le segment"
        message={`Êtes-vous sûr de vouloir supprimer le segment "${segmentToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
