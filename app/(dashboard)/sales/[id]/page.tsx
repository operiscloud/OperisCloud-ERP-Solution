import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, User, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import DeleteOrderButton from '@/components/orders/DeleteOrderButton';
import PdfDownloadButtons from '@/components/orders/PdfDownloadButtons';
import { hasFeatureAccess } from '@/lib/plan-features-server';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true, tenant: { select: { currency: true, plan: true } } },
  });

  if (!user) {
    redirect('/onboarding');
  }

  const hasPdfAccess = await hasFeatureAccess('hasPdfGeneration');

  const order = await prisma.order.findUnique({
    where: {
      id,
      tenantId: user.tenantId,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/sales" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Commande #{order.orderNumber}</h1>
            <p className="text-gray-600">Détails de la commande</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <PdfDownloadButtons orderId={order.id} orderNumber={order.orderNumber} hasPdfAccess={hasPdfAccess} plan={user.tenant.plan} />
          {(order.status === 'DRAFT' || order.status === 'CANCELLED') && (
            <Link
              href={`/sales/${order.id}/edit`}
              className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-medium"
            >
              Modifier
            </Link>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Statut</h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getOrderStatusColor(
                order.status
              )}`}
            >
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Montant total</h2>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(Number(order.total), user.tenant.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Client
        </h2>

        {order.customer ? (
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Nom: </span>
              <span className="text-sm font-medium text-gray-900">
                {order.customer.firstName} {order.customer.lastName}
              </span>
            </div>
            {order.customer.email && (
              <div>
                <span className="text-sm text-gray-500">Email: </span>
                <span className="text-sm font-medium text-gray-900">{order.customer.email}</span>
              </div>
            )}
            {order.customer.phone && (
              <div>
                <span className="text-sm text-gray-500">Téléphone: </span>
                <span className="text-sm font-medium text-gray-900">{order.customer.phone}</span>
              </div>
            )}
          </div>
        ) : order.guestName ? (
          <div>
            <span className="text-sm text-gray-500">Client invité: </span>
            <span className="text-sm font-medium text-gray-900">{order.guestName}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun client associé</p>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Produits
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                {item.sku && <div className="text-sm text-gray-500">SKU: {item.sku}</div>}
                {item.variant && (
                  <div className="text-sm text-blue-600 mt-1">{item.variant.name}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {item.quantity} × {formatCurrency(Number(item.unitPrice), user.tenant.currency)}
                </div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(Number(item.totalPrice), user.tenant.currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Résumé</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>{formatCurrency(Number(order.subtotal), user.tenant.currency)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>TVA ({Number(order.taxRate)}%)</span>
            <span>{formatCurrency(Number(order.taxAmount), user.tenant.currency)}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Remise</span>
              <span>- {formatCurrency(Number(order.discount), user.tenant.currency)}</span>
            </div>
          )}
          {Number(order.shippingCost) > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{formatCurrency(Number(order.shippingCost), user.tenant.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(Number(order.total), user.tenant.currency)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Informations complémentaires
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Date de création</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDateTime(order.createdAt)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Dernière mise à jour</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDateTime(order.updatedAt)}
            </div>
          </div>

          {order.paymentMethod && (
            <div>
              <div className="text-sm text-gray-500">Méthode de paiement</div>
              <div className="text-sm font-medium text-gray-900 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                {order.paymentMethod}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-500">Statut de paiement</div>
            <div className="text-sm font-medium text-gray-900">
              {order.paymentStatus === 'PAID' ? 'Payé' :
               order.paymentStatus === 'PENDING' ? 'En attente' :
               order.paymentStatus === 'PARTIAL' ? 'Partiel' : 'Remboursé'}
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-500 mb-1">Notes</div>
            <div className="text-sm text-gray-900">{order.notes}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-4">
        <DeleteOrderButton orderId={order.id} orderNumber={order.orderNumber} />
        <Link
          href="/sales"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Retour
        </Link>
      </div>
    </div>
  );
}
