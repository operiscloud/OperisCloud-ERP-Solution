'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReminderSettings } from '@prisma/client';

interface ReminderSettingsFormProps {
  settings: ReminderSettings;
  tenantEmail: string | null;
}

export default function ReminderSettingsForm({ settings, tenantEmail }: ReminderSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    enabled: settings.enabled,
    firstReminderDays: settings.firstReminderDays,
    secondReminderDays: settings.secondReminderDays,
    finalReminderDays: settings.finalReminderDays,
    sendToAdmin: settings.sendToAdmin,
    sendToCustomer: settings.sendToCustomer,
    adminEmail: settings.adminEmail || tenantEmail || '',
    emailTemplate: settings.emailTemplate || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/settings/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update');

      alert('Paramètres mis à jour avec succès!');
      router.refresh();
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <label htmlFor="enabled" className="text-sm font-medium text-gray-900">
            Activer les rappels automatiques
          </label>
          <p className="text-sm text-gray-600">
            Les rappels seront envoyés selon la configuration ci-dessous
          </p>
        </div>
        <input
          type="checkbox"
          id="enabled"
          name="enabled"
          checked={formData.enabled}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </div>

      {/* Reminder Intervals */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Intervalles de rappel</h3>
        <p className="text-sm text-gray-600">
          Définissez le nombre de jours après la date d'échéance pour chaque rappel
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="firstReminderDays" className="block text-sm font-medium text-gray-700 mb-2">
              Premier rappel (jours)
            </label>
            <input
              type="number"
              id="firstReminderDays"
              name="firstReminderDays"
              value={formData.firstReminderDays}
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.enabled}
            />
          </div>

          <div>
            <label htmlFor="secondReminderDays" className="block text-sm font-medium text-gray-700 mb-2">
              Deuxième rappel (jours)
            </label>
            <input
              type="number"
              id="secondReminderDays"
              name="secondReminderDays"
              value={formData.secondReminderDays}
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.enabled}
            />
          </div>

          <div>
            <label htmlFor="finalReminderDays" className="block text-sm font-medium text-gray-700 mb-2">
              Rappel final (jours)
            </label>
            <input
              type="number"
              id="finalReminderDays"
              name="finalReminderDays"
              value={formData.finalReminderDays}
              onChange={handleChange}
              min="1"
              max="365"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.enabled}
            />
          </div>
        </div>
      </div>

      {/* Recipients */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Destinataires</h3>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendToCustomer"
              name="sendToCustomer"
              checked={formData.sendToCustomer}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={!formData.enabled}
            />
            <label htmlFor="sendToCustomer" className="ml-3 text-sm text-gray-700">
              Envoyer au client (email du client sur la commande)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendToAdmin"
              name="sendToAdmin"
              checked={formData.sendToAdmin}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={!formData.enabled}
            />
            <label htmlFor="sendToAdmin" className="ml-3 text-sm text-gray-700">
              Envoyer à l'administrateur (copie pour information)
            </label>
          </div>
        </div>

        {formData.sendToAdmin && (
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email administrateur
            </label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!formData.enabled}
              required={formData.sendToAdmin}
            />
            <p className="text-sm text-gray-500 mt-1">
              Cet email recevra une copie de tous les rappels envoyés
            </p>
          </div>
        )}
      </div>

      {/* Email Template (Optional Advanced Feature) */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Modèle d'email (optionnel)</h3>
        <p className="text-sm text-gray-600">
          Laissez vide pour utiliser le modèle par défaut. Variables disponibles: {'{'}{'{'} orderNumber {'}'}{'}'}, {'{'}{'{'} total {'}'}{'}'}, {'{'}{'{'} currency {'}'}{'}'}, {'{'}{'{'} dueDate {'}'}{'}'}, {'{'}{'{'} companyName {'}'}{'}'}
        </p>
        <textarea
          id="emailTemplate"
          name="emailTemplate"
          value={formData.emailTemplate}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          disabled={!formData.enabled}
          placeholder="Laissez vide pour utiliser le modèle par défaut..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
        </button>
      </div>
    </form>
  );
}
