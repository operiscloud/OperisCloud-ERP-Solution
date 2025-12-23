import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Gift, Calendar, CreditCard } from 'lucide-react';
import { getPlan } from '@/lib/plans';
import FeaturePaywallPage from '@/components/paywall/FeaturePaywallPage';

export default async function GiftCardsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true, plan: true } } },
  });

  if (!user) redirect('/onboarding');

  // Check plan access server-side
  const plan = getPlan(user.tenant.plan);
  if (!plan.features.hasGiftCards) {
    return <FeaturePaywallPage feature="giftcards" />;
  }

  const giftCards = await prisma.giftCard.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: 'desc' },
  });

  const currency = user.tenant.currency;

  // Calculate statistics
  const totalValue = giftCards.reduce((sum, card) => sum + Number(card.balance), 0);
  const activeCards = giftCards.filter((card) => card.isActive && (!card.expiresAt || new Date(card.expiresAt) > new Date()));
  const expiredCards = giftCards.filter((card) => card.expiresAt && new Date(card.expiresAt) <= new Date());

  return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bons cadeaux</h1>
          <p className="text-gray-600">Gérez vos bons cadeaux et cartes prépayées</p>
        </div>
        <Link
          href="/giftcards/new"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau bon cadeau
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bons actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeCards.length}</p>
            </div>
            <Gift className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valeur totale</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalValue.toFixed(2)} {currency}
              </p>
            </div>
            <CreditCard className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bons expirés</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{expiredCards.length}</p>
            </div>
            <Calendar className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-lg shadow">
        {giftCards.length === 0 ? (
          <div className="p-12 text-center">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun bon cadeau</h3>
            <p className="text-gray-600 mb-4">Créez votre premier bon cadeau</p>
            <Link
              href="/giftcards/new"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau bon cadeau
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant initial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solde</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {giftCards.map((card) => {
                  const isExpired = card.expiresAt && new Date(card.expiresAt) <= new Date();
                  const isUsed = Number(card.balance) === 0;

                  return (
                    <tr key={card.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{card.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(card.initialAmount).toFixed(2)} {currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(card.balance).toFixed(2)} {currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            isExpired
                              ? 'bg-red-100 text-red-800'
                              : isUsed
                              ? 'bg-gray-100 text-gray-800'
                              : card.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {isExpired ? 'Expiré' : isUsed ? 'Utilisé' : card.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {card.expiresAt
                          ? new Date(card.expiresAt).toLocaleDateString('fr-FR')
                          : 'Pas d\'expiration'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(card.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/giftcards/${card.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Voir détails
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
