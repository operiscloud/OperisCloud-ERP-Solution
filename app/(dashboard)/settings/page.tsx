import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Settings as SettingsIcon, Palette, ShoppingCart, Building2, Users, Upload, Check, X, FolderTree } from 'lucide-react';
import Link from 'next/link';
import { getPlan } from '@/lib/plans';
import PDFTemplateLink from '@/components/settings/PDFTemplateLink';
import LogoUpload from '@/components/settings/LogoUpload';

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { tenant: true },
  });

  if (!user) redirect('/onboarding');

  // Get plan features
  const plan = getPlan(user.tenant.plan);

  // Get usage statistics
  const totalProducts = await prisma.product.count({
    where: { tenantId: user.tenantId },
  });

  const totalCustomers = await prisma.customer.count({
    where: { tenantId: user.tenantId },
  });

  const totalUsers = await prisma.user.count({
    where: { tenantId: user.tenantId },
  });

  // Calculate usage percentages
  const productsPercentage = plan.limits.maxProducts === 0 ? 0 : Math.min(100, (totalProducts / plan.limits.maxProducts) * 100);
  const customersPercentage = plan.limits.maxCustomers === 0 ? 0 : Math.min(100, (totalCustomers / plan.limits.maxCustomers) * 100);
  const usersPercentage = plan.limits.maxUsers === 0 ? 0 : Math.min(100, (totalUsers / plan.limits.maxUsers) * 100);

  // Define all available modules
  // Note: Inventory, Sales, and CRM are available in all plans but with different limits
  // Finance and GiftCards are PRO+ features
  const allModules = [
    {
      name: 'Inventory',
      label: 'Inventaire',
      isEnabled: true, // Available in all plans
      description: plan.id === 'FREE' ? 'Max 50 produits' : plan.limits.maxProducts === 0 ? 'Produits illimités' : `Max ${plan.limits.maxProducts} produits`
    },
    {
      name: 'Sales',
      label: 'Ventes',
      isEnabled: true, // Available in all plans
      description: plan.id === 'FREE' ? 'Max 30 commandes/mois' : plan.limits.maxOrdersPerMonth === 0 ? 'Commandes illimitées' : `Max ${plan.limits.maxOrdersPerMonth} commandes/mois`
    },
    {
      name: 'CRM',
      label: 'CRM',
      isEnabled: true, // Available in all plans
      description: plan.id === 'FREE' ? 'Max 25 clients' : 'Clients illimités'
    },
    {
      name: 'Finance',
      label: 'Finance',
      isEnabled: plan.features.hasFinanceModule,
      description: plan.features.hasFinanceModule ? 'Gestion financière complète' : 'Requiert plan PRO'
    },
    {
      name: 'GiftCards',
      label: 'Bons cadeaux',
      isEnabled: plan.features.hasGiftCards,
      description: plan.features.hasGiftCards ? 'Création et gestion' : 'Requiert plan PRO'
    },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez les paramètres de votre entreprise</p>
      </div>

      {/* Tenant Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Informations générales
        </h2>

        {/* Logo Upload */}
        <LogoUpload currentLogo={user.tenant.logo} tenantId={user.tenantId} />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={user.tenant.name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subdomain
            </label>
            <input
              type="text"
              value={`${user.tenant.subdomain}.businesshub.app`}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industrie
            </label>
            <input
              type="text"
              value={user.tenant.industryId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise
            </label>
            <input
              type="text"
              value={user.tenant.currency}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <input
              type="text"
              value={user.tenant.language}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan actuel
            </label>
            <input
              type="text"
              value={user.tenant.plan}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            💡 La modification des paramètres sera disponible dans une prochaine version.
          </p>
        </div>
      </div>

      {/* Plan Usage */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Utilisation du plan</h2>
          <Link
            href="/pricing"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Changer de plan →
          </Link>
        </div>

        <div className="space-y-4">
          {/* Products usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Produits</span>
              <span className="text-sm text-gray-600">
                {totalProducts} / {plan.limits.maxProducts === 0 ? '∞' : plan.limits.maxProducts}
              </span>
            </div>
            {plan.limits.maxProducts > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    productsPercentage >= 90
                      ? 'bg-red-600'
                      : productsPercentage >= 70
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${productsPercentage}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Customers usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Clients</span>
              <span className="text-sm text-gray-600">
                {totalCustomers} / {plan.limits.maxCustomers === 0 ? '∞' : plan.limits.maxCustomers}
              </span>
            </div>
            {plan.limits.maxCustomers > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    customersPercentage >= 90
                      ? 'bg-red-600'
                      : customersPercentage >= 70
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${customersPercentage}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Users usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Utilisateurs</span>
              <span className="text-sm text-gray-600">
                {totalUsers} / {plan.limits.maxUsers === 0 ? '∞' : plan.limits.maxUsers}
              </span>
            </div>
            {plan.limits.maxUsers > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    usersPercentage >= 90
                      ? 'bg-red-600'
                      : usersPercentage >= 70
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  }`}
                  style={{ width: `${usersPercentage}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {(productsPercentage >= 80 || customersPercentage >= 80 || usersPercentage >= 80) && (
          <div className="pt-4 border-t">
            <p className="text-sm text-amber-600">
              ⚠️ Vous approchez des limites de votre plan. Pensez à passer à un plan supérieur pour continuer à utiliser toutes les fonctionnalités.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Configuration avancée</h2>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/settings/company"
            className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Informations de l'entreprise</div>
              <div className="text-sm text-gray-500">Adresse, N° de TVA, factures</div>
            </div>
          </Link>

          <Link
            href="/settings/categories"
            className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FolderTree className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Catégories de produits</div>
              <div className="text-sm text-gray-500">Organiser vos produits</div>
            </div>
          </Link>

          <Link
            href="/settings/variants"
            className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Palette className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Variantes de produits</div>
              <div className="text-sm text-gray-500">Taille, couleur, etc.</div>
            </div>
          </Link>

          <PDFTemplateLink
            hasAccess={user.tenant.plan === 'PRO' || user.tenant.plan === 'BUSINESS'}
            currentPlan={user.tenant.plan}
          />

          <Link
            href="/settings/sales"
            className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Paramètres de vente</div>
              <div className="text-sm text-gray-500">TVA, livraison, moyens de paiement</div>
            </div>
          </Link>

          {(user.role === 'OWNER' || user.role === 'ADMIN') && (
            <Link
              href="/settings/team"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Gestion de l'équipe</div>
                <div className="text-sm text-gray-500">Utilisateurs et permissions</div>
              </div>
            </Link>
          )}

          {['OWNER', 'ADMIN', 'MANAGER'].includes(user.role) && (
            <Link
              href="/settings/import"
              className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Import de données</div>
                <div className="text-sm text-gray-500">Importer des produits, clients, etc.</div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Modules disponibles</h2>
          <Link
            href="/pricing"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Changer de plan →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allModules.map((module) => {
            return (
              <div
                key={module.name}
                className={`px-4 py-3 border rounded-lg ${
                  module.isEnabled
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {module.label}
                  </span>
                  {module.isEnabled ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="mt-1">
                  <span
                    className={`text-xs font-medium ${
                      module.isEnabled ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {module.isEnabled ? 'Activé' : 'Non disponible'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-600">
                    {module.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            💡 Les modules sont activés automatiquement selon votre plan. Passez à un plan supérieur pour débloquer plus de fonctionnalités.
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Votre profil</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
