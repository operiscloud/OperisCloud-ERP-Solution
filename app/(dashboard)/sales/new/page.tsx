'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Search, X } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number | string;
  stockQuantity: number;
  attributes: any;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number | string;
  sku: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initialAmount: number;
  isActive: boolean;
  expiresAt: Date | null;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const currency = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [type, setType] = useState<'ORDER' | 'QUOTE' | 'INVOICE'>('ORDER');
  const [status, setStatus] = useState<'DRAFT' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'>('DRAFT');
  const [channel, setChannel] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED'>('PENDING');
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [taxRate, setTaxRate] = useState(8.1);
  const [notes, setNotes] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);

  // Data lists
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<string[]>([]);
  const [availableSalesChannels, setAvailableSalesChannels] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantSelector, setShowVariantSelector] = useState(false);

  // Load products, customers, gift cards, and settings
  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, customersRes, giftCardsRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/customers'),
          fetch('/api/giftcards'),
          fetch('/api/settings/sales'),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }

        if (customersRes.ok) {
          const data = await customersRes.json();
          setCustomers(data.customers || []);
        }

        if (giftCardsRes.ok) {
          const data = await giftCardsRes.json();
          // Filter only active gift cards with balance and convert Decimal to number
          const activeGiftCards = (data.giftCards || [])
            .map((gc: any) => ({
              ...gc,
              balance: Number(gc.balance),
              initialAmount: Number(gc.initialAmount),
            }))
            .filter(
              (gc: GiftCard) => gc.isActive && gc.balance > 0 && (!gc.expiresAt || new Date(gc.expiresAt) > new Date())
            );
          setGiftCards(activeGiftCards);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const settings = data.settings || {};

          setAvailablePaymentMethods(settings.paymentMethods || ['Virement bancaire', 'TWINT', 'Cash']);
          setAvailableSalesChannels(settings.salesChannels || ['Stand', 'Site web', 'Instagram', 'WhatsApp']);

          if (settings.taxEnabled !== false) {
            setTaxRate(settings.defaultTaxRate || 8.1);
          } else {
            setTaxRate(0);
          }

          if (settings.shippingEnabled) {
            setShippingCost(settings.defaultShippingCost || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }

    loadData();
  }, []);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalBeforeGiftCard = subtotal + taxAmount - discount + shippingCost;
  const total = Math.max(0, totalBeforeGiftCard - giftCardDiscount);

  // Add product to order
  const addProduct = (product: Product) => {
    // If product has variants, show variant selector
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setSelectedProduct(product);
      setShowVariantSelector(true);
      setSearchProduct('');
      return;
    }

    // For simple products, add directly
    const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
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
          unitPrice: productPrice,
        },
      ]);
    }
    setSearchProduct('');
  };

  // Add variant to order
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
  };

  // Remove product from order
  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.productId !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  // Apply gift card
  const applyGiftCard = () => {
    if (!giftCardCode) {
      setError('Veuillez sélectionner un bon cadeau');
      return;
    }

    const selectedGiftCard = giftCards.find(gc => gc.code === giftCardCode);

    if (!selectedGiftCard) {
      setError('Bon cadeau invalide ou non disponible');
      return;
    }

    setAppliedGiftCard(selectedGiftCard);
    const discountAmount = Math.min(selectedGiftCard.balance, totalBeforeGiftCard);
    setGiftCardDiscount(discountAmount);
    setError('');
  };

  // Remove applied gift card
  const removeGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardDiscount(0);
    setGiftCardCode('');
  };

  // Update item price
  const updatePrice = (productId: string, unitPrice: number) => {
    setItems(
      items.map((item) =>
        item.productId === productId ? { ...item, unitPrice } : item
      )
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (items.length === 0) {
      setError('Veuillez ajouter au moins un produit');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId || null,
          orderNumber: orderNumber || undefined,
          orderDate: orderDate ? new Date(orderDate).toISOString() : undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          type,
          status,
          channel: channel || undefined,
          paymentMethod,
          paymentStatus,
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.productName,
            sku: item.productSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          discount,
          shippingCost,
          taxRate,
          notes: notes || undefined,
          giftCardCode: appliedGiftCard?.code || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      router.push('/sales');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      (p.sku?.toLowerCase() || '').includes(searchProduct.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      (c.firstName?.toLowerCase() || '').includes(searchCustomer.toLowerCase()) ||
      (c.lastName?.toLowerCase() || '').includes(searchCustomer.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(searchCustomer.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle Commande</h1>
        <p className="text-gray-600">Créer une nouvelle commande client</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Client</h2>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher un client (optionnel)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Nom, prénom ou email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {searchCustomer && filteredCustomers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setCustomerId(customer.id);
                      setSearchCustomer(`${customer.firstName} ${customer.lastName}`);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </span>
                    <span className="text-sm text-gray-500">{customer.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {customerId && (
            <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg flex justify-between items-center">
              <span className="text-sm text-blue-900">Client sélectionné</span>
              <button
                type="button"
                onClick={() => {
                  setCustomerId('');
                  setSearchCustomer('');
                }}
                className="text-sm text-blue-700 hover:text-blue-900"
              >
                Retirer
              </button>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Produits</h2>

          {/* Product Search */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {searchProduct && filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {(typeof product.price === 'string' ? parseFloat(product.price) : product.price).toFixed(2)} €
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun produit ajouté. Recherchez et ajoutez des produits ci-dessus.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productName}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                    <span className="text-gray-600">×</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updatePrice(item.productId, parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                    />
                    <span className="text-gray-600">{currency}</span>
                    <span className="w-24 text-right font-medium text-gray-900">
                      {(item.quantity * item.unitPrice).toFixed(2)} {currency}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variant Selector Modal */}
        {showVariantSelector && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sélectionnez une variante - {selectedProduct.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVariantSelector(false);
                      setSelectedProduct(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {selectedProduct.variants?.filter(v => v.isActive).map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => addVariant(selectedProduct, variant)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{variant.name}</div>
                        {variant.sku && (
                          <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">
                          Stock: {variant.stockQuantity} unité(s)
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price).toFixed(2)} {currency}
                      </div>
                    </div>
                  </button>
                ))}

                {selectedProduct.variants?.filter(v => v.isActive).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune variante active disponible
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calculations */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Calculs</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remise ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de livraison ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TVA (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bon cadeau (optionnel)
            </label>
            {!appliedGiftCard ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un bon cadeau</option>
                    {giftCards.map((gc) => (
                      <option key={gc.id} value={gc.code}>
                        {gc.code} - {gc.balance.toFixed(2)} {currency}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={applyGiftCard}
                    disabled={!giftCardCode}
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  >
                    Appliquer
                  </button>
                </div>
                {giftCards.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Aucun bon cadeau disponible
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-pink-50 border border-pink-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appliedGiftCard.code}</p>
                  <p className="text-sm text-gray-600">
                    Solde: {appliedGiftCard.balance.toFixed(2)} {currency} - Appliqué: {giftCardDiscount.toFixed(2)} {currency}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeGiftCard}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>TVA ({taxRate}%)</span>
              <span>{taxAmount.toFixed(2)} {currency}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Remise</span>
                <span>- {discount.toFixed(2)} {currency}</span>
              </div>
            )}
            {shippingCost > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{shippingCost.toFixed(2)} {currency}</span>
              </div>
            )}
            {giftCardDiscount > 0 && (
              <div className="flex justify-between text-pink-600">
                <span>Bon cadeau ({appliedGiftCard?.code})</span>
                <span>- {giftCardDiscount.toFixed(2)} {currency}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{total.toFixed(2)} {currency}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Détails</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de commande (optionnel)
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Généré automatiquement"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de la commande
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance (optionnel)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pour les factures uniquement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ORDER' | 'QUOTE' | 'INVOICE')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ORDER">Commande</option>
                <option value="QUOTE">Devis</option>
                <option value="INVOICE">Facture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="PROCESSING">En traitement</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
                <option value="REFUNDED">Remboursée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de vente
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                {availableSalesChannels.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de paiement
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PENDING">En attente</option>
                <option value="PAID">Payé</option>
                <option value="PARTIAL">Partiel</option>
                <option value="REFUNDED">Remboursé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Notes internes sur la commande..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/sales')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
}
