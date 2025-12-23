import { DollarSign, Gift, Check } from 'lucide-react';
import Link from 'next/link';

interface FeaturePaywallPageProps {
  feature: 'finance' | 'giftcards';
}

const featureConfig = {
  finance: {
    icon: DollarSign,
    title: 'Module Finance',
    description: 'Suivez vos dépenses, revenus et profitabilité. Gérez votre trésorerie et prenez de meilleures décisions financières.',
    features: [
      'Suivi des dépenses et revenus',
      'Calcul automatique de la profitabilité',
      'Catégorisation des dépenses',
      'Rapports financiers détaillés',
    ],
    color: 'green',
  },
  giftcards: {
    icon: Gift,
    title: 'Bons Cadeaux',
    description: 'Vendez des bons cadeaux à vos clients. Augmentez vos revenus et fidélisez votre clientèle avec un système de bons cadeaux personnalisés.',
    features: [
      'Création de bons cadeaux personnalisés',
      'Gestion des soldes et validité',
      'Utilisation partielle des bons',
      'Suivi des ventes de bons cadeaux',
    ],
    color: 'purple',
  },
};

export default function FeaturePaywallPage({ feature }: FeaturePaywallPageProps) {
  const config = featureConfig[feature];
  const Icon = config.icon;

  const colorClasses = {
    green: {
      gradient: 'from-green-50 to-emerald-50 border-green-200',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700',
    },
    purple: {
      gradient: 'from-purple-50 to-pink-50 border-purple-200',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
  }[config.color];

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className={`bg-gradient-to-br ${colorClasses.gradient} border-2 rounded-2xl p-12 text-center`}>
        <div className={`${colorClasses.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
          <Icon className={`h-10 w-10 ${colorClasses.iconText}`} />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {config.title}
        </h1>

        <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
          {config.description}
        </p>

        <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités {config.title}:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {config.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Check className={`h-5 w-5 ${colorClasses.iconText}`} />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/pricing"
          className={`inline-block ${colorClasses.button} text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
        >
          Débloquer avec Pro - 29 CHF/mois
        </Link>

        <p className="text-sm text-gray-600 mt-4">
          Essai gratuit 14 jours • Aucune carte requise
        </p>
      </div>
    </div>
  );
}
