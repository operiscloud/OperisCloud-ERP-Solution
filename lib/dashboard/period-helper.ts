import { PeriodOption } from '@/components/dashboard/PeriodSelector';

export function getPeriodDates(period: PeriodOption): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  let start: Date;

  switch (period) {
    case '7days':
      start = new Date(now);
      start.setDate(start.getDate() - 7);
      break;

    case '30days':
      start = new Date(now);
      start.setDate(start.getDate() - 30);
      break;

    case '3months':
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;

    case '6months':
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;

    case '12months':
      start = new Date(now.getFullYear(), now.getMonth() - 12, 1);
      break;

    case 'all':
      start = new Date(2000, 0, 1); // Far enough in the past to include all data
      break;

    default:
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  }

  return { start, end };
}

export function getMonthsForPeriod(period: PeriodOption): number {
  switch (period) {
    case '7days':
    case '30days':
      return 1; // Show current month for short periods
    case '3months':
      return 3;
    case '6months':
      return 6;
    case '12months':
      return 12;
    case 'all':
      return 24; // Max 24 months for visualization
    default:
      return 6;
  }
}

export function formatDateRange(period: PeriodOption): string {
  const { start, end } = getPeriodDates(period);

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };

  if (period === 'all') {
    return 'Toutes les données';
  }

  return `${start.toLocaleDateString('fr-FR', formatOptions)} - ${end.toLocaleDateString('fr-FR', formatOptions)}`;
}
