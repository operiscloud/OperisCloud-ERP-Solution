'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates';
import { Check, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingTenant, setCheckingTenant] = useState(true);

  const [formData, setFormData] = useState({
    businessName: '',
    subdomain: '',
    industryId: '',
  });

  // Check if user already has a tenant
  useEffect(() => {
    async function checkExistingTenant() {
      if (!isLoaded || !user) return;

      try {
        const response = await fetch('/api/user/tenant');
        const data = await response.json();

        // If user has a tenant, redirect to dashboard
        if (data.hasTenant) {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error checking tenant:', err);
      } finally {
        setCheckingTenant(false);
      }
    }

    checkExistingTenant();
  }, [isLoaded, user, router]);

  const handleIndustrySelect = (industryId: string) => {
    setFormData({ ...formData, industryId });
  };

  const handleBusinessNameChange = (name: string) => {
    // Generate subdomain suggestion
    const subdomain = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);

    setFormData({ ...formData, businessName: name, subdomain });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const selectedIndustry = INDUSTRY_TEMPLATES.find((t) => t.id === formData.industryId);

  // Show loading while checking tenant
  if (checkingTenant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">OperisCloud</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue {user?.firstName} !
          </h1>
          <p className="text-gray-600">
            Configurons votre espace en quelques étapes
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > 2 ? <Check className="h-5 w-5" /> : '2'}
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Industry Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quelle est votre activité ?
              </h2>
              <p className="text-gray-600 mb-6">
                Sélectionnez votre secteur pour une configuration optimale
              </p>

              <div className="grid grid-cols-2 gap-4">
                {INDUSTRY_TEMPLATES.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => handleIndustrySelect(industry.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      formData.industryId === industry.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{industry.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {industry.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {industry.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.industryId}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Informations de votre entreprise
              </h2>
              <p className="text-gray-600 mb-6">
                Ces informations seront visibles sur vos documents
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de votre entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleBusinessNameChange(e.target.value)}
                    placeholder="Ex: Boutique Marie"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-domaine
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) =>
                        setFormData({ ...formData, subdomain: e.target.value })
                      }
                      placeholder="mon-entreprise"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                      .businesshub.app
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Votre URL personnalisée pour accéder à OperisCloud
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.businessName || !formData.subdomain}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmez votre configuration
              </h2>
              <p className="text-gray-600 mb-6">
                Vérifiez que tout est correct avant de créer votre espace
              </p>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">Activité</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl">{selectedIndustry?.icon}</span>
                    <span className="font-semibold text-gray-900">
                      {selectedIndustry?.name}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Nom de l&apos;entreprise
                  </div>
                  <div className="font-semibold text-gray-900 mt-1">
                    {formData.businessName}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500">URL</div>
                  <div className="font-mono text-blue-600 mt-1">
                    {formData.subdomain}.businesshub.app
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Modules inclus
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIndustry?.modules.map((module) => (
                      <span
                        key={module}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  <span>{loading ? 'Création...' : 'Créer mon espace'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
