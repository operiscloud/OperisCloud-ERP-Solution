'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Palette, Eye, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface PDFTemplateConfig {
  templateType: 'retail' | 'professional' | 'tech';
  primaryColor: string;
  secondaryColor: string;
  headerStyle: 'classic' | 'modern' | 'minimal';
  fontStyle: 'helvetica' | 'times' | 'courier';
  showLogo: boolean;
  showCompanyInfo: boolean;
  showBankInfo: boolean;
  accentColor: string;
  logoSize?: 'small' | 'medium' | 'large';
}

interface CompanyInfo {
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  taxNumber?: string | null;
  footer?: string | null;
}

interface PDFTemplateConfigClientProps {
  tenantId: string;
  companyName: string;
  companyLogo?: string | null;
  initialConfig: PDFTemplateConfig;
  companyInfo: CompanyInfo;
}

export default function PDFTemplateConfigClient({
  tenantId,
  companyName,
  companyLogo,
  initialConfig,
  companyInfo,
}: PDFTemplateConfigClientProps) {
  const router = useRouter();
  const toast = useToast();
  const [config, setConfig] = useState<PDFTemplateConfig>(initialConfig);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch('/api/settings/pdf-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de sauvegarde', data.error || 'Impossible de sauvegarder la configuration');
        throw new Error(data.error);
      }

      toast.success('Configuration sauvegardée', 'Vos préférences de template PDF ont été mises à jour');
      router.refresh();
    } catch (err) {
      // Error already shown in toast
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(initialConfig);
  };

  const applyTemplatePreset = (templateType: 'retail' | 'professional' | 'tech') => {
    const presets = {
      retail: {
        templateType: 'retail' as const,
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        accentColor: '#10b981',
        headerStyle: 'modern' as const,
        fontStyle: 'helvetica' as const,
        showLogo: true,
        showCompanyInfo: true,
        showBankInfo: true,
        logoSize: 'medium' as const,
      },
      professional: {
        templateType: 'professional' as const,
        primaryColor: '#1e293b',
        secondaryColor: '#64748b',
        accentColor: '#0f172a',
        headerStyle: 'classic' as const,
        fontStyle: 'times' as const,
        showLogo: true,
        showCompanyInfo: true,
        showBankInfo: true,
        logoSize: 'medium' as const,
      },
      tech: {
        templateType: 'tech' as const,
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
        headerStyle: 'minimal' as const,
        fontStyle: 'helvetica' as const,
        showLogo: true,
        showCompanyInfo: true,
        showBankInfo: true,
        logoSize: 'medium' as const,
      },
    };

    setConfig(presets[templateType]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates PDF</h1>
          <p className="text-gray-600 mt-1">
            Personnalisez l'apparence de vos factures et devis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Presets */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Modèles par industrie
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez un modèle prédéfini adapté à votre secteur d'activité
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => applyTemplatePreset('retail')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.templateType === 'retail'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Commerce / Retail</div>
                <div className="text-sm text-gray-600">
                  Moderne et coloré, idéal pour les boutiques et e-commerce
                </div>
              </button>

              <button
                onClick={() => applyTemplatePreset('professional')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.templateType === 'professional'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Services Professionnels</div>
                <div className="text-sm text-gray-600">
                  Formel et élégant, pour consultants, avocats, comptables
                </div>
              </button>

              <button
                onClick={() => applyTemplatePreset('tech')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  config.templateType === 'tech'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Tech / Startup</div>
                <div className="text-sm text-gray-600">
                  Clean et moderne, parfait pour les entreprises technologiques
                </div>
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Couleurs
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur principale
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur secondaire
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="#64748b"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur accent
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="#10b981"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Style
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style d'en-tête
                </label>
                <select
                  value={config.headerStyle}
                  onChange={(e) => setConfig({ ...config, headerStyle: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="modern">Moderne</option>
                  <option value="classic">Classique</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Police de caractères
                </label>
                <select
                  value={config.fontStyle}
                  onChange={(e) => setConfig({ ...config, fontStyle: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="helvetica">Helvetica (Standard)</option>
                  <option value="times">Times New Roman (Formel)</option>
                  <option value="courier">Courier (Technique)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options d'affichage
            </h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => setConfig({ ...config, showLogo: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">Afficher le logo</span>
              </label>

              {config.showLogo && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille du logo
                  </label>
                  <select
                    value={config.logoSize || 'medium'}
                    onChange={(e) => setConfig({ ...config, logoSize: e.target.value as 'small' | 'medium' | 'large' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="small">Petit (80x40px)</option>
                    <option value="medium">Moyen (120x60px)</option>
                    <option value="large">Grand (160x80px)</option>
                  </select>
                </div>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.showCompanyInfo}
                  onChange={(e) => setConfig({ ...config, showCompanyInfo: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Afficher les informations de l'entreprise
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.showBankInfo}
                  onChange={(e) => setConfig({ ...config, showBankInfo: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Afficher les informations bancaires
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Prévisualisation
          </h3>
          <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
            {/* Mock Invoice Preview */}
            <div style={{ fontFamily: config.fontStyle === 'helvetica' ? 'Arial, sans-serif' : config.fontStyle === 'times' ? 'Times New Roman, serif' : 'Courier New, monospace' }}>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  {config.showLogo && companyLogo && (
                    <img
                      src={companyLogo}
                      alt="Logo"
                      className="mb-4"
                      style={{
                        maxWidth: config.logoSize === 'small' ? '80px' : config.logoSize === 'large' ? '160px' : '120px',
                        maxHeight: config.logoSize === 'small' ? '40px' : config.logoSize === 'large' ? '80px' : '60px',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                  <h2 className="text-xl font-bold" style={{ color: config.primaryColor }}>
                    {companyName}
                  </h2>
                  {config.showCompanyInfo && (
                    <div className="text-sm mt-2 space-y-0.5" style={{ color: '#000' }}>
                      {companyInfo.address && <div>{companyInfo.address}</div>}
                      {companyInfo.postalCode && companyInfo.city && (
                        <div>{companyInfo.postalCode} {companyInfo.city}</div>
                      )}
                      {companyInfo.phone && <div>Tél: {companyInfo.phone}</div>}
                      {companyInfo.email && <div>Email: {companyInfo.email}</div>}
                      {companyInfo.taxNumber && <div>TVA: {companyInfo.taxNumber}</div>}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold" style={{ color: config.primaryColor }}>
                    FACTURE
                  </h1>
                  <div className="text-sm mt-2" style={{ color: '#000' }}>
                    <div>N° FAC-2024-001</div>
                    <div>Date: 21.12.2024</div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 p-4 rounded" style={{ backgroundColor: `${config.primaryColor}10` }}>
                <div className="text-sm font-semibold mb-1" style={{ color: '#000' }}>
                  Facturer à:
                </div>
                <div className="text-sm">
                  <div className="font-medium" style={{ color: '#000' }}>Client Example SA</div>
                  <div style={{ color: '#000' }}>Rue de l'Exemple 123</div>
                  <div style={{ color: '#000' }}>1000 Lausanne</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-sm mb-6">
                <thead>
                  <tr style={{ backgroundColor: config.primaryColor, color: 'white' }}>
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2">Qté</th>
                    <th className="text-right p-2">Prix unit.</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${config.secondaryColor}30` }}>
                    <td className="p-2" style={{ color: '#000' }}>Produit exemple</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>2</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>100.00 CHF</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>200.00 CHF</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${config.secondaryColor}30` }}>
                    <td className="p-2" style={{ color: '#000' }}>Service consultation</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>1</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>150.00 CHF</td>
                    <td className="text-right p-2" style={{ color: '#000' }}>150.00 CHF</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: '#000' }}>Sous-total:</span>
                    <span style={{ color: '#000' }}>350.00 CHF</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#000' }}>TVA (7.7%):</span>
                    <span style={{ color: '#000' }}>26.95 CHF</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t-2" style={{ borderColor: config.primaryColor }}>
                    <span style={{ color: '#000' }}>Total:</span>
                    <span style={{ color: '#000' }}>376.95 CHF</span>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              {config.showBankInfo && (
                <div className="text-sm p-4 rounded" style={{ backgroundColor: `${config.secondaryColor}10`, color: '#000' }}>
                  <div className="font-semibold mb-2">Coordonnées bancaires:</div>
                  <div>IBAN: CH93 0000 0000 0000 0000 0</div>
                  <div>BIC: EXAMPLECH</div>
                </div>
              )}

              {/* Footer */}
              {companyInfo.footer && (
                <div className="mt-6 pt-4 border-t text-center text-xs" style={{ color: config.secondaryColor, borderColor: `${config.secondaryColor}30` }}>
                  {companyInfo.footer}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 La prévisualisation montre l'apparence approximative de vos PDF. Les factures générées peuvent varier légèrement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
