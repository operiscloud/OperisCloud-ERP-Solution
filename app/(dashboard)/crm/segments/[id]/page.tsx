'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

const COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange dark
];

interface Segment {
  id: string;
  name: string;
  description: string | null;
  color: string;
  criteria: {
    totalSpent?: { min?: number; max?: number };
    orderCount?: { min?: number; max?: number };
    tags?: string[];
    city?: string[];
  };
}

export default function EditSegmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: COLORS[0],
    criteria: {
      totalSpent: { min: undefined as number | undefined, max: undefined as number | undefined },
      orderCount: { min: undefined as number | undefined, max: undefined as number | undefined },
      tags: [] as string[],
      city: [] as string[],
    },
  });
  const [newTag, setNewTag] = useState('');
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    loadSegment();
  }, []);

  const loadSegment = async () => {
    try {
      const response = await fetch(`/api/segments/${unwrappedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setSegment(data.segment);
        setFormData({
          name: data.segment.name,
          description: data.segment.description || '',
          color: data.segment.color,
          criteria: {
            totalSpent: data.segment.criteria.totalSpent || { min: undefined, max: undefined },
            orderCount: data.segment.criteria.orderCount || { min: undefined, max: undefined },
            tags: data.segment.criteria.tags || [],
            city: data.segment.criteria.city || [],
          },
        });
      } else {
        alert('Segment non trouvé');
        router.push('/crm/segments');
      }
    } catch (error) {
      console.error('Error loading segment:', error);
      alert('Erreur lors du chargement du segment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/segments/${unwrappedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification du segment');
      }

      alert('Segment modifié avec succès! Les clients seront réassignés selon les nouveaux critères.');
      router.push('/crm/segments');
    } catch (error: any) {
      console.error('Error updating segment:', error);
      alert(error.message || 'Erreur lors de la modification du segment');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.criteria.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        criteria: {
          ...formData.criteria,
          tags: [...formData.criteria.tags, newTag.trim()],
        },
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria,
        tags: formData.criteria.tags.filter(t => t !== tag),
      },
    });
  };

  const addCity = () => {
    if (newCity.trim() && !formData.criteria.city.includes(newCity.trim())) {
      setFormData({
        ...formData,
        criteria: {
          ...formData.criteria,
          city: [...formData.criteria.city, newCity.trim()],
        },
      });
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria,
        city: formData.criteria.city.filter(c => c !== city),
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!segment) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Segment non trouvé</p>
        <Link href="/crm/segments" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
          Retour aux segments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/crm/segments"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le segment</h1>
          <p className="text-gray-600">
            Mettez à jour les critères de segmentation
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Informations de base</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du segment *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Clients VIP, Clients réguliers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
              placeholder="Décrivez ce segment..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Criteria */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Critères de segmentation</h2>

          {/* Total Spent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant total dépensé (CHF)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Minimum"
                value={formData.criteria.totalSpent.min || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      totalSpent: {
                        ...formData.criteria.totalSpent,
                        min: e.target.value ? Number(e.target.value) : undefined,
                      },
                    },
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Maximum"
                value={formData.criteria.totalSpent.max || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      totalSpent: {
                        ...formData.criteria.totalSpent,
                        max: e.target.value ? Number(e.target.value) : undefined,
                      },
                    },
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Order Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de commandes
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Minimum"
                value={formData.criteria.orderCount.min || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      orderCount: {
                        ...formData.criteria.orderCount,
                        min: e.target.value ? Number(e.target.value) : undefined,
                      },
                    },
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Maximum"
                value={formData.criteria.orderCount.max || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: {
                      ...formData.criteria,
                      orderCount: {
                        ...formData.criteria.orderCount,
                        max: e.target.value ? Number(e.target.value) : undefined,
                      },
                    },
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Ajouter un tag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.criteria.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Villes
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                placeholder="Ajouter une ville..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addCity}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.criteria.city.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {city}
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/crm/segments"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
