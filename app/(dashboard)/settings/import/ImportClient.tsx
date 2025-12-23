'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, FileSpreadsheet, Check } from 'lucide-react';
import Link from 'next/link';

type ImportType = 'products' | 'variants' | 'customers' | 'orders';

interface ImportResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

interface ImportClientProps {
  hasImportAccess: boolean;
}

export default function ImportClient({ hasImportAccess }: ImportClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('products');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', importType);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          imported: data.imported,
        });
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setResult({
          success: false,
          message: data.error || 'Erreur lors de l\'import',
          errors: data.errors,
        });
      }
    } catch (error) {
      console.error('Error importing:', error);
      setResult({
        success: false,
        message: 'Erreur lors de l\'import',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (type: ImportType) => {
    const link = document.createElement('a');
    link.href = `/api/import/template?type=${type}`;
    link.download = `template-${type}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show paywall for FREE plan
  if (!hasImportAccess) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Import Excel
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            Importez vos produits, clients et commandes en masse depuis Excel.
            Gagnez des heures de saisie manuelle.
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Ce que vous pouvez importer:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Produits avec variantes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Clients avec historique
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Commandes complètes
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Templates Excel pré-formatés
              </li>
            </ul>
          </div>

          <Link
            href="/pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import de données</h1>
        <p className="text-gray-600 mt-2">
          Importez vos produits, variantes, clients ou commandes depuis un fichier Excel
        </p>
      </div>

      {/* Import Type Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Type de données</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setImportType('products')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              importType === 'products'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium text-gray-900">Produits</div>
            <div className="text-sm text-gray-600">Importer des produits</div>
          </button>

          <button
            onClick={() => setImportType('variants')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              importType === 'variants'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium text-gray-900">Variantes</div>
            <div className="text-sm text-gray-600">Importer des variantes de produits</div>
          </button>

          <button
            onClick={() => setImportType('customers')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              importType === 'customers'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium text-gray-900">Clients</div>
            <div className="text-sm text-gray-600">Importer des clients</div>
          </button>

          <button
            onClick={() => setImportType('orders')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              importType === 'orders'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium text-gray-900">Commandes</div>
            <div className="text-sm text-gray-600">Importer des commandes</div>
          </button>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <FileSpreadsheet className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="font-medium text-blue-900">Télécharger le modèle</h3>
            <p className="text-sm text-blue-700 mt-1">
              Téléchargez le fichier modèle Excel pour {importType === 'products' ? 'les produits' : importType === 'variants' ? 'les variantes' : importType === 'customers' ? 'les clients' : 'les commandes'}
            </p>
            <button
              onClick={() => downloadTemplate(importType)}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Télécharger le modèle →
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fichier à importer</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="mb-4">
            <label
              htmlFor="file-input"
              className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
            >
              Choisir un fichier
            </label>
            <input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-gray-600 mt-1">ou glisser-déposer</p>
          </div>
          {file && (
            <div className="text-sm text-gray-900 font-medium">
              Fichier sélectionné: {file.name}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Formats acceptés: .xlsx, .xls
          </p>
        </div>

        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Import en cours...' : 'Importer'}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg p-4 ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <h3
                className={`font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.message}
              </h3>
              {result.imported !== undefined && (
                <p className="text-sm text-green-700 mt-1">
                  {result.imported} élément(s) importé(s)
                </p>
              )}
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {result.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6 mt-6">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Téléchargez le modèle Excel correspondant au type de données</li>
          <li>Remplissez le fichier avec vos données</li>
          <li>Ne modifiez pas les noms des colonnes</li>
          <li>Assurez-vous que les données obligatoires sont présentes</li>
          <li>Importez le fichier rempli</li>
        </ul>
      </div>
    </div>
  );
}
