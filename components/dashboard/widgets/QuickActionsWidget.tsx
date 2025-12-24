import { ShoppingCart, Package, Users } from 'lucide-react';

export function QuickActionsWidget() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <a
        href="/sales/new"
        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Nouvelle commande</h3>
            <p className="text-sm text-gray-600">Créer une vente rapidement</p>
          </div>
        </div>
      </a>

      <a
        href="/inventory/new"
        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ajouter un produit</h3>
            <p className="text-sm text-gray-600">Enrichir votre catalogue</p>
          </div>
        </div>
      </a>

      <a
        href="/crm/new"
        className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Nouveau client</h3>
            <p className="text-sm text-gray-600">Ajouter à votre CRM</p>
          </div>
        </div>
      </a>
    </div>
  );
}
