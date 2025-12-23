'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CompanySettingsFormProps {
  tenant: {
    id: string;
    name: string;
    companyAddress: string | null;
    companyCity: string | null;
    companyPostalCode: string | null;
    companyCountry: string | null;
    companyPhone: string | null;
    companyEmail: string | null;
    companyWebsite: string | null;
    taxNumber: string | null;
    registrationNumber: string | null;
    invoiceFooter: string | null;
    bankName: string | null;
    bankIBAN: string | null;
    bankBIC: string | null;
    bankAccountHolder: string | null;
  };
}

export default function CompanySettingsForm({ tenant }: CompanySettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyAddress: tenant.companyAddress || '',
    companyCity: tenant.companyCity || '',
    companyPostalCode: tenant.companyPostalCode || '',
    companyCountry: tenant.companyCountry || 'Suisse',
    companyPhone: tenant.companyPhone || '',
    companyEmail: tenant.companyEmail || '',
    companyWebsite: tenant.companyWebsite || '',
    taxNumber: tenant.taxNumber || '',
    registrationNumber: tenant.registrationNumber || '',
    invoiceFooter: tenant.invoiceFooter || '',
    bankName: tenant.bankName || '',
    bankIBAN: tenant.bankIBAN || '',
    bankBIC: tenant.bankBIC || '',
    bankAccountHolder: tenant.bankAccountHolder || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings/company', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update');

      alert('Informations mises à jour avec succès!');
      router.refresh();
    } catch (error) {
      console.error('Error updating company info:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom de l'entreprise
        </label>
        <input
          type="text"
          value={tenant.name}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
        <p className="mt-1 text-xs text-gray-500">
          Le nom de l'entreprise ne peut pas être modifié ici
        </p>
      </div>

      {/* Address */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleChange}
            placeholder="Rue et numéro"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code postal
          </label>
          <input
            type="text"
            name="companyPostalCode"
            value={formData.companyPostalCode}
            onChange={handleChange}
            placeholder="1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <input
            type="text"
            name="companyCity"
            value={formData.companyCity}
            onChange={handleChange}
            placeholder="Lausanne"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays
          </label>
          <input
            type="text"
            name="companyCountry"
            value={formData.companyCountry}
            onChange={handleChange}
            placeholder="Suisse"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            placeholder="+41 21 123 45 67"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="companyEmail"
            value={formData.companyEmail}
            onChange={handleChange}
            placeholder="contact@entreprise.ch"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site web
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://www.entreprise.ch"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tax & Registration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de TVA
          </label>
          <input
            type="text"
            name="taxNumber"
            value={formData.taxNumber}
            onChange={handleChange}
            placeholder="CHE-123.456.789"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro d'entreprise
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="CHE-123.456.789"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bank Information */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations bancaires
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Ces informations apparaîtront sur vos factures pour faciliter les paiements
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la banque
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="UBS Switzerland AG"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              name="bankIBAN"
              value={formData.bankIBAN}
              onChange={handleChange}
              placeholder="CH93 0076 2011 6238 5295 7"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BIC/SWIFT
            </label>
            <input
              type="text"
              name="bankBIC"
              value={formData.bankBIC}
              onChange={handleChange}
              placeholder="UBSWCHZH80A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titulaire du compte
            </label>
            <input
              type="text"
              name="bankAccountHolder"
              value={formData.bankAccountHolder}
              onChange={handleChange}
              placeholder="Nom de l'entreprise"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="pt-6 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pied de page des factures/devis
        </label>
        <textarea
          name="invoiceFooter"
          value={formData.invoiceFooter}
          onChange={handleChange}
          rows={3}
          placeholder="Merci pour votre confiance! Conditions de paiement: 30 jours nets."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Ce texte apparaîtra en bas de vos factures et devis
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
