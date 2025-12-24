'use client';

import { useState } from 'react';
import { ScanBarcode, Package, Plus, ShoppingCart } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { Plan } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface BarcodeScannerButtonProps {
  currentPlan: Plan;
}

export default function BarcodeScannerButton({ currentPlan }: BarcodeScannerButtonProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Only available for PRO and BUSINESS plans
  const hasAccess = currentPlan === 'PRO' || currentPlan === 'BUSINESS';

  const handleScan = async (barcode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/barcode?code=${encodeURIComponent(barcode)}`);
      const data = await response.json();

      if (data.found) {
        setProduct(data);
        setShowResult(true);
      } else {
        // Product not found - ask if they want to create one
        const createNew = window.confirm(
          `Code-barres ${barcode} non trouvé.\n\nVoulez-vous créer un nouveau produit avec ce code-barres?`
        );
        if (createNew) {
          router.push(`/products/new?barcode=${encodeURIComponent(barcode)}`);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Erreur lors de la recherche du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToOrder = () => {
    // Navigate to new order page with product pre-filled
    if (product.isVariant) {
      router.push(`/orders/new?variantId=${product.variant.id}`);
    } else {
      router.push(`/orders/new?productId=${product.product.id}`);
    }
    setShowResult(false);
  };

  const handleViewProduct = () => {
    router.push(`/products/${product.product.id}`);
    setShowResult(false);
  };

  if (!hasAccess) {
    return null; // Don't show button for FREE plan
  }

  return (
    <>
      {/* Scanner button */}
      <button
        onClick={() => setShowScanner(true)}
        className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
        title="Scanner un code-barres"
      >
        <span className="sr-only">Scanner un code-barres</span>
        <ScanBarcode className="h-6 w-6" />
      </button>

      {/* Scanner modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Result modal */}
      {showResult && product && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Produit trouvé</h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Product info */}
            <div className="p-6 space-y-4">
              {/* Image */}
              {product.product.images && product.product.images[0] && (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.product.images[0]}
                    alt={product.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {product.product.name}
                </h4>
                {product.isVariant && (
                  <p className="text-sm text-gray-600 mt-1">{product.variant.name}</p>
                )}
                {product.product.description && (
                  <p className="text-sm text-gray-600 mt-2">{product.product.description}</p>
                )}
              </div>

              {/* Price and stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Prix</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.isVariant
                      ? product.variant.price
                      : product.product.price}{' '}
                    CHF
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Stock</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {product.isVariant
                      ? product.variant.stockQuantity
                      : product.product.stockQuantity}{' '}
                    unités
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={handleAddToOrder}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter à une commande
                </button>
                <button
                  onClick={handleViewProduct}
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="h-5 w-5" />
                  Voir le produit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-900 font-medium">Recherche du produit...</p>
          </div>
        </div>
      )}
    </>
  );
}
