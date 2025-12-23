'use client';

import { Zap } from 'lucide-react';
import UsageIndicator from '@/components/paywall/UsageIndicator';
import Link from 'next/link';

export default function PlanUsageWidget() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Utilisation de votre plan</h3>
        </div>
        <Link
          href="/pricing"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Voir les plans
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UsageIndicator limitType="products" />
        <UsageIndicator limitType="orders" />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Passez à <span className="font-semibold text-blue-600">Pro</span> pour débloquer toutes
          les fonctionnalités
        </p>
      </div>
    </div>
  );
}
