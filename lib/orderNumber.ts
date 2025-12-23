import { prisma } from '@/lib/prisma';

/**
 * Génère le prochain numéro de commande
 * Format: {préfixe}-{numéro séquentiel}
 *
 * @param tenantId - ID du tenant
 * @returns Le numéro de commande généré (ex: "2025-12-0001")
 */
export async function generateOrderNumber(tenantId: string): Promise<string> {
  // Récupérer les paramètres de vente du tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { industrySettings: true },
  });

  if (!tenant) {
    throw new Error('Tenant non trouvé');
  }

  const industrySettings = (tenant.industrySettings as any) || {};
  const salesSettings = industrySettings.salesSettings || {};

  // Déterminer le préfixe
  let prefix = salesSettings.orderNumberPrefix || '';

  // Si pas de préfixe défini, utiliser AAAA-MM (année-mois actuel)
  if (!prefix) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    prefix = `${year}-${month}`;
  }

  // Récupérer le compteur pour ce préfixe
  const orderCounters = salesSettings.orderCounters || {};
  const currentCounter = orderCounters[prefix] || 0;
  const nextCounter = currentCounter + 1;

  // Formater le numéro (padding à 4 chiffres)
  const formattedNumber = String(nextCounter).padStart(4, '0');
  const orderNumber = `${prefix}-${formattedNumber}`;

  // Mettre à jour le compteur
  orderCounters[prefix] = nextCounter;
  industrySettings.salesSettings = {
    ...salesSettings,
    orderCounters,
  };

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      industrySettings,
    },
  });

  return orderNumber;
}
