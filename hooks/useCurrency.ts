import { useState, useEffect } from 'react';

export function useCurrency() {
  const [currency, setCurrency] = useState('CHF');

  useEffect(() => {
    async function loadCurrency() {
      try {
        const response = await fetch('/api/settings/sales');
        if (response.ok) {
          const data = await response.json();
          const settings = data.settings || {};
          setCurrency(settings.currency || 'CHF');
        }
      } catch (err) {
        console.error('Failed to load currency:', err);
      }
    }

    loadCurrency();
  }, []);

  return currency;
}
