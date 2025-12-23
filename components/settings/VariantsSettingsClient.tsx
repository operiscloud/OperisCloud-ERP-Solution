'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Save, Lock, Check } from 'lucide-react';
import Link from 'next/link';

interface VariantOption {
  name: string;
  values: string[];
}

interface VariantsSettingsClientProps {
  hasAccess: boolean;
}

export default function VariantsSettingsClient({ hasAccess }: VariantsSettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [newOptionName, setNewOptionName] = useState('');
  const [newValueInputs, setNewValueInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (hasAccess) {
      loadVariantOptions();
    }
  }, [hasAccess]);

  const loadVariantOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/variant-options');
      if (response.ok) {
        const data = await response.json();
        setVariantOptions(data.variantOptions || []);
      }
    } catch (err) {
      console.error('Failed to load variant options:', err);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (!newOptionName.trim()) return;

    if (variantOptions.some(opt => opt.name.toLowerCase() === newOptionName.toLowerCase())) {
      setError('Cette option existe déjà');
      return;
    }

    setVariantOptions([...variantOptions, { name: newOptionName, values: [] }]);
    setNewOptionName('');
    setError('');
  };

  const removeOption = (optionName: string) => {
    setVariantOptions(variantOptions.filter(opt => opt.name !== optionName));
  };

  const addValue = (optionName: string) => {
    const newValue = newValueInputs[optionName]?.trim();
    if (!newValue) return;

    setVariantOptions(
      variantOptions.map(opt => {
        if (opt.name === optionName) {
          if (opt.values.includes(newValue)) {
            setError(`La valeur "${newValue}" existe déjà pour ${optionName}`);
            return opt;
          }
          return { ...opt, values: [...opt.values, newValue] };
        }
        return opt;
      })
    );

    setNewValueInputs({ ...newValueInputs, [optionName]: '' });
    setError('');
  };

  const removeValue = (optionName: string, value: string) => {
    setVariantOptions(
      variantOptions.map(opt => {
        if (opt.name === optionName) {
          return { ...opt, values: opt.values.filter(v => v !== value) };
        }
        return opt;
      })
    );
  };

  const saveVariantOptions = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Filter out options with no values
      const filteredOptions = variantOptions.filter(opt => opt.values.length > 0);

      const response = await fetch('/api/settings/variant-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantOptions: filteredOptions }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      // Update local state with filtered options
      setVariantOptions(filteredOptions);
      setSuccess('Configuration des variantes sauvegardée avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Show paywall for users without access
  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-12 text-center">
          <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-indigo-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuration des Variantes
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Définissez et gérez les options de variantes pour vos produits (taille, couleur, matière, etc.).
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Avec les variantes vous pouvez:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Créer des options personnalisées (Taille, Couleur, etc.)
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Définir les valeurs disponibles pour chaque option
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Gérer stock et prix par variante
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Génération automatique des combinaisons
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Débloquer avec Pro - 29 CHF/mois
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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuration des Variantes</h1>
        <p className="text-gray-600">
          Définissez les options de variantes disponibles pour vos produits (taille, couleur, etc.)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Add New Option */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Ajouter une option de variante</h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addOption()}
            placeholder="Ex: Taille, Couleur, Matériau..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addOption}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Variant Options List */}
      {variantOptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 mb-4">Aucune option de variante configurée</p>
          <p className="text-sm text-gray-400">
            Ajoutez des options comme "Taille", "Couleur", etc. pour créer des variantes de produits
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {variantOptions.map((option) => (
            <div key={option.name} className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                <button
                  onClick={() => removeOption(option.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Values */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Valeurs disponibles
                </label>

                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <div
                      key={value}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                    >
                      <span className="text-sm text-gray-900">{value}</span>
                      <button
                        onClick={() => removeValue(option.name, value)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Value Input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newValueInputs[option.name] || ''}
                    onChange={(e) =>
                      setNewValueInputs({ ...newValueInputs, [option.name]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && addValue(option.name)}
                    placeholder={`Ajouter une valeur pour ${option.name}...`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => addValue(option.name)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      {variantOptions.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={saveVariantOptions}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Comment utiliser les variantes ?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Créez d'abord vos options de variantes ici (Taille, Couleur, etc.)</li>
          <li>Ajoutez les valeurs possibles pour chaque option (S, M, L pour Taille)</li>
          <li>Lors de la création d'un produit, activez "Utiliser des variantes"</li>
          <li>Vous pourrez alors générer toutes les combinaisons avec des prix spécifiques</li>
        </ul>
      </div>
    </div>
  );
}
