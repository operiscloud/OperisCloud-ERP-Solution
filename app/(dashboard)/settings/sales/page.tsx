'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, X } from 'lucide-react';

export default function SalesSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Virement bancaire', 'TWINT', 'Cash']);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const [salesChannels, setSalesChannels] = useState<string[]>(['Stand', 'Site web', 'Instagram', 'WhatsApp']);
  const [newSalesChannel, setNewSalesChannel] = useState('');

  const [currency, setCurrency] = useState('CHF');

  const [taxEnabled, setTaxEnabled] = useState(true);
  const [defaultTaxRate, setDefaultTaxRate] = useState('8.1');

  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [defaultShippingCost, setDefaultShippingCost] = useState('0');

  const [orderNumberPrefix, setOrderNumberPrefix] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/sales');
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || {};

        setPaymentMethods(settings.paymentMethods || ['Virement bancaire', 'TWINT', 'Cash']);
        setSalesChannels(settings.salesChannels || ['Stand', 'Site web', 'Instagram', 'WhatsApp']);
        setCurrency(settings.currency || 'CHF');
        setTaxEnabled(settings.taxEnabled !== false);
        setDefaultTaxRate(settings.defaultTaxRate?.toString() || '8.1');
        setShippingEnabled(settings.shippingEnabled || false);
        setDefaultShippingCost(settings.defaultShippingCost?.toString() || '0');
        setOrderNumberPrefix(settings.orderNumberPrefix || '');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()]);
      setNewPaymentMethod('');
    }
  };

  const removePaymentMethod = (method: string) => {
    setPaymentMethods(paymentMethods.filter(m => m !== method));
  };

  const addSalesChannel = () => {
    if (newSalesChannel.trim() && !salesChannels.includes(newSalesChannel.trim())) {
      setSalesChannels([...salesChannels, newSalesChannel.trim()]);
      setNewSalesChannel('');
    }
  };

  const removeSalesChannel = (channel: string) => {
    setSalesChannels(salesChannels.filter(c => c !== channel));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethods,
          salesChannels,
          currency,
          taxEnabled,
          defaultTaxRate: parseFloat(defaultTaxRate),
          shippingEnabled,
          defaultShippingCost: parseFloat(defaultShippingCost),
          orderNumberPrefix: orderNumberPrefix.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setSuccess('Paramètres sauvegardés avec succès');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres de vente</h1>
        <p className="text-gray-600">Configurez les paramètres par défaut pour vos commandes et ventes</p>
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

      {/* Currency */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Devise</h2>
          <p className="text-sm text-gray-600">Choisissez la devise par défaut pour toutes les transactions</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Devise par défaut</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="CHF">CHF - Franc Suisse</option>
            <option value="EUR">EUR - Euro</option>
            <option value="USD">USD - Dollar Américain</option>
            <option value="GBP">GBP - Livre Sterling</option>
            <option value="CAD">CAD - Dollar Canadien</option>
            <option value="JPY">JPY - Yen Japonais</option>
            <option value="AUD">AUD - Dollar Australien</option>
            <option value="CNY">CNY - Yuan Chinois</option>
          </select>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Moyens de paiement</h2>
          <p className="text-sm text-gray-600">Configurez les moyens de paiement disponibles pour les commandes et dépenses</p>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-900">{method}</span>
              <button
                type="button"
                onClick={() => removePaymentMethod(method)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPaymentMethod()}
              placeholder="Nouveau moyen de paiement"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={addPaymentMethod}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Channels */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Canaux de vente</h2>
          <p className="text-sm text-gray-600">Configurez les canaux de vente disponibles pour les commandes</p>
        </div>

        <div className="space-y-3">
          {salesChannels.map((channel) => (
            <div
              key={channel}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-900">{channel}</span>
              <button
                type="button"
                onClick={() => removeSalesChannel(channel)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={newSalesChannel}
              onChange={(e) => setNewSalesChannel(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSalesChannel()}
              placeholder="Nouveau canal de vente"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="button"
              onClick={addSalesChannel}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">TVA</h2>
          <p className="text-sm text-gray-600">Configurez le taux de TVA par défaut</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => setTaxEnabled(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Activer la TVA par défaut
          </label>
        </div>

        {taxEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux de TVA par défaut (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={defaultTaxRate}
              onChange={(e) => setDefaultTaxRate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
      </div>

      {/* Shipping Settings */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Livraison</h2>
          <p className="text-sm text-gray-600">Configurez les frais de livraison par défaut</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={shippingEnabled}
            onChange={(e) => setShippingEnabled(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Activer les frais de livraison par défaut
          </label>
        </div>

        {shippingEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de livraison par défaut ({currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={defaultShippingCost}
              onChange={(e) => setDefaultShippingCost(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}
      </div>

      {/* Order Number Settings */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Numérotation des commandes</h2>
          <p className="text-sm text-gray-600">Configurez le format des numéros de commande</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Préfixe des numéros de commande
          </label>
          <input
            type="text"
            value={orderNumberPrefix}
            onChange={(e) => setOrderNumberPrefix(e.target.value)}
            placeholder="Ex: 2025-12 ou CMD"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-gray-500 mt-2">
            Si vide, le format sera automatiquement AAAA-MM (année-mois actuel).
            Les commandes seront numérotées: {orderNumberPrefix || 'AAAA-MM'}-0001, {orderNumberPrefix || 'AAAA-MM'}-0002, etc.
          </p>
          {orderNumberPrefix && (
            <p className="text-xs text-blue-600 mt-1">
              Exemple: {orderNumberPrefix}-0001, {orderNumberPrefix}-0002, etc.
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}
