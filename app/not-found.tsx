'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="h-5 w-5 mr-2" />
              Retour au Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Page précédente
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Liens utiles :</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/sales"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                Ventes
              </Link>
              <Link
                href="/inventory"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                Inventaire
              </Link>
              <Link
                href="/crm"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                Clients
              </Link>
              <Link
                href="/settings"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                Paramètres
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Erreur 404 • OperisCloud
          </p>
        </div>
      </div>
    </div>
  );
}
