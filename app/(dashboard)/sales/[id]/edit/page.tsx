'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, X, Search } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/hooks/useCurrency';

interface Product {
  id: string;
  name: string;
  price: number | string;
  sku: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number | string;
  stockQuantity: number;
  attributes: any;
  isActive: boolean;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  type: string;
  customerId: string | null;
  customer: Customer | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string | null;
  notes: string | null;
  items: Array<{
    id: string;
    productId: string | null;
    variantId: string | null;
    name: string;
    sku: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product?: { name: string };
    variant?: { name: string };
  }>;
}

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const currency = useCurrency();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    status: 'DRAFT',
    type: 'ORDER',
    paymentMethod: '',
    paymentStatus: 'PENDING',
    taxRate: '8.1',
    discount: '0',
    shippingCost: '0',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    loadOrder();
    loadCustomers();
    loadProducts();
    loadSettings();
  }, []);

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const orderData = data.order;
        setOrder(orderData);

        // Populate form data
        setFormData({
          customerId: orderData.customerId || '',
          guestName: orderData.guestName || '',
          guestEmail: orderData.guestEmail || '',
          guestPhone: orderData.guestPhone || '',
          status: orderData.status,
          type: orderData.type,
          paymentMethod: orderData.paymentMethod || '',
          paymentStatus: orderData.paymentStatus || 'PENDING',
          taxRate: orderData.taxRate.toString(),
          discount: orderData.discount.toString(),
          shippingCost: orderData.shippingCost ? orderData.shippingCost.toString() : '0',
          dueDate: orderData.dueDate ? new Date(orderData.dueDate).toISOString().split('T')[0] : '',
          notes: orderData.notes || '',
        });

        // Populate items
        setItems(
          orderData.items.map((item: any) => ({
            productId: item.productId || '',
            variantId: item.variantId,
            productName: item.name,
            productSku: item.sku || '',
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
          }))
        );
      } else {
        setError('Commande non trouvée');
      }
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/sales');
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || {};
        setAvailablePaymentMethods(settings.paymentMethods || ['Virement bancaire', 'TWINT', 'Cash']);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      (c.lastName && c.lastName.toLowerCase().includes(searchCustomer.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchCustomer.toLowerCase()))
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addProduct = (product: Product) => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setShowVariantSelector(true);
      setSearchProduct('');
      return;
    }

    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const existing = items.find((item) => item.productId === product.id && !item.variantId);

    if (existing) {
      setItems(
        items.map((item) =>
          item.productId === product.id && !item.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantity: 1,
          unitPrice: price,
        },
      ]);
    }
    setSearchProduct('');
  };

  const addVariant = (product: Product, variant: ProductVariant) => {
    const variantPrice = typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price;
    const existing = items.find(
      (item) => item.productId === product.id && item.variantId === variant.id
    );

    if (existing) {
      setItems(
        items.map((item) =>
          item.productId === product.id && item.variantId === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          variantId: variant.id,
          productName: `${product.name} - ${variant.name}`,
          productSku: variant.sku || product.sku,
          quantity: 1,
          unitPrice: variantPrice,
        },
      ]);
    }

    setShowVariantSelector(false);
    setSelectedProduct(null);
    setSearchProduct('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const updatePrice = (index: number, price: number) => {
    if (price < 0) return;
    setItems(items.map((item, i) => (i === index ? { ...item, unitPrice: price } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * parseFloat(formData.taxRate)) / 100;
  const discount = parseFloat(formData.discount);
  const shippingCost = parseFloat(formData.shippingCost);
  const total = subtotal + taxAmount + shippingCost - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError('Ajoutez au moins un produit à la commande');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: formData.customerId || undefined,
          guestName: formData.guestName || undefined,
          guestEmail: formData.guestEmail || undefined,
          guestPhone: formData.guestPhone || undefined,
          status: formData.status,
          type: formData.type,
          paymentMethod: formData.paymentMethod || undefined,
          paymentStatus: formData.paymentStatus,
          taxRate: parseFloat(formData.taxRate),
          discount: parseFloat(formData.discount),
          shippingCost: parseFloat(formData.shippingCost),
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
          notes: formData.notes || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.productName,
            sku: item.productSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      router.push(`/sales/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
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

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Commande non trouvée</p>
        <Link href="/sales" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Retour aux ventes
        </Link>
      </div>
    );
  }

  // Check if order can be edited
  if (order.status === 'CONFIRMED' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Cette commande ne peut pas être modifiée car elle est déjà confirmée.</p>
        <Link href={`/sales/${params.id}`} className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Voir la commande
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/sales/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier la commande</h1>
          <p className="text-gray-600">Commande {order.orderNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Produits</h3>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {searchProduct && filteredProducts.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </button>
                  ))}
                </div>
              )}

              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun produit ajouté. Recherchez et ajoutez des produits à la commande.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">{item.productSku}</div>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updatePrice(index, parseFloat(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="w-24 text-right font-medium text-gray-900">
                        {currency} {(item.quantity * item.unitPrice).toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Client</h3>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchCustomer}
                  onChange={(e) => {
                    setSearchCustomer(e.target.value);
                    setFormData({ ...formData, customerId: '' });
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {searchCustomer && filteredCustomers.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          customerId: customer.id,
                          guestName: '',
                          guestEmail: '',
                          guestPhone: '',
                        });
                        setSearchCustomer(
                          `${customer.firstName} ${customer.lastName || ''}`.trim()
                        );
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </div>
                      {customer.email && (
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!formData.customerId && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="text-sm text-gray-600">Ou commande invité :</p>
                  <input
                    type="text"
                    placeholder="Nom du client"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Détails</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="DRAFT">Brouillon</option>
                  <option value="CONFIRMED">Confirmé</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ORDER">Commande</option>
                  <option value="QUOTE">Devis</option>
                  <option value="INVOICE">Facture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance (optionnel)
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Pour les factures uniquement"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moyen de paiement
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Sélectionner...</option>
                  {availablePaymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut du paiement
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="PARTIAL">Partiel</option>
                  <option value="REFUNDED">Remboursé</option>
                </select>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Total</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total</span>
                  <span>{currency} {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">TVA</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-gray-700">%</span>
                    <span className="text-gray-700">{currency} {taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Livraison</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{currency}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Remise</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{currency}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>{currency} {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Notes internes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/sales/${params.id}`}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Variant Selector Modal */}
      {showVariantSelector && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Sélectionner une variante - {selectedProduct.name}
              </h3>
              <button
                onClick={() => {
                  setShowVariantSelector(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {selectedProduct.variants?.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => addVariant(selectedProduct, variant)}
                  disabled={!variant.isActive}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{variant.name}</div>
                      <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                      <div className="text-sm text-gray-500">Stock: {variant.stockQuantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {currency}{' '}
                        {typeof variant.price === 'string'
                          ? parseFloat(variant.price).toFixed(2)
                          : variant.price.toFixed(2)}
                      </div>
                      {!variant.isActive && (
                        <div className="text-xs text-red-600">Inactive</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
