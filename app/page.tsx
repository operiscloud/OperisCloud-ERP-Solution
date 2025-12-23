import Link from 'next/link';
import {
  ArrowRight, Check, Package, Users, TrendingUp, FileText, Gift, BarChart3,
  Zap, Shield, Clock, Globe, Sparkles, Star, MessageCircle, ArrowUpRight
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OperisCloud - Solution de Gestion ERP pour PME et Artisans en Suisse',
  description: 'Logiciel de gestion d\'entreprise tout-en-un pour PME suisses. Gestion des stocks, ventes, clients, factures et comptabilité. Essai gratuit sans carte bancaire.',
  keywords: 'ERP Suisse, logiciel gestion PME, facturation Suisse, gestion stock, CRM Suisse, comptabilité PME, logiciel artisan, bons cadeaux',
  openGraph: {
    title: 'OperisCloud - ERP pour PME Suisses',
    description: 'Solution de gestion complète adaptée aux PME et artisans suisses',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OperisCloud
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Tarifs
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Témoignages
              </Link>
              <Link href="#faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:shadow-lg hover:scale-105 font-semibold transition-all text-sm sm:text-base whitespace-nowrap"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 md:py-28">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-top"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                Sécurisé et conforme aux normes suisses
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              La gestion d'entreprise
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                simplifiée pour les PME
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              OperisCloud réunit tous vos outils de gestion en une seule plateforme intuitive.
              Gagnez du temps, réduisez vos coûts et développez votre activité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 font-bold text-lg transition-all"
              >
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 font-bold text-lg transition-all"
              >
                Voir la démo
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Configuration en 5 min</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Support francophone</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium">Ils nous font confiance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {/* Placeholder pour logos clients - à remplacer par de vrais logos */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-gray-400 font-bold text-2xl">
                Client {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin,
              <br />
              <span className="text-blue-600">en une seule plateforme</span>
            </h2>
            <p className="text-xl text-gray-600">
              Modules intégrés et personnalisables selon votre activité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Inventory */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Gestion de Stock
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Catalogue produits complet avec variantes, codes-barres, alertes de stock bas et traçabilité.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Codes-barres et SKU
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Alertes stock bas
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Variantes produits
                </li>
              </ul>
            </div>

            {/* CRM */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                CRM Clients
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Centralisez vos données clients, historique d'achats et segmentation intelligente.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Fiches clients détaillées
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Segmentation automatique
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Historique complet
                </li>
              </ul>
            </div>

            {/* Sales */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ventes & Facturation
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Créez devis et factures professionnels en PDF avec templates personnalisables.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Factures PDF conformes
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Templates personnalisés
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Multi-canaux de vente
                </li>
              </ul>
            </div>

            {/* Finance */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Comptabilité Simple
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Suivi des dépenses, catégories personnalisables et exports pour votre comptable.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Suivi en temps réel
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Exports comptables
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Catégories flexibles
                </li>
              </ul>
            </div>

            {/* Gift Cards */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-pink-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gift className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Bons Cadeaux
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Gestion complète des bons cadeaux avec codes uniques et suivi des soldes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Codes uniques sécurisés
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Gestion des soldes
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Dates d'expiration
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-500 hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Analytics & Rapports
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Tableaux de bord détaillés, graphiques interactifs et exports Excel.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  KPIs en temps réel
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Graphiques avancés (PRO)
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  Exports personnalisés
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Pourquoi choisir OperisCloud ?
              </h2>
              <p className="text-xl text-gray-600">
                Des avantages concrets pour votre entreprise
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Rapide à déployer
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Configurez votre compte en moins de 5 minutes. Templates pré-configurés selon votre industrie pour démarrer immédiatement.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Sécurité maximale
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Hébergement sécurisé, sauvegardes automatiques quotidiennes et conformité RGPD. Vos données sont protégées.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Gagnez du temps
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automatisez vos tâches répétitives. Créez une facture en 30 secondes. Synchronisation en temps réel sur tous vos appareils.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Accessible partout
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Gérez votre entreprise depuis n'importe où : bureau, atelier, boutique ou déplacement. Interface mobile responsive.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Interface intuitive
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Design moderne et épuré. Aucune formation nécessaire. Prise en main immédiate pour vous et votre équipe.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    Support réactif
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Support client francophone par email. Documentation complète et tutoriels vidéo. Communauté active d'utilisateurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Des tarifs transparents
              <br />
              <span className="text-blue-600">adaptés à votre croissance</span>
            </h2>
            <p className="text-xl text-gray-600">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuit</h3>
                <p className="text-gray-600">Pour démarrer et tester</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">0</span>
                  <span className="text-gray-600 ml-2">CHF/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Jusqu'à 100 produits</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Jusqu'à 50 clients</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1 utilisateur</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tableau de bord simple</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Support par email</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-gray-100 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* PRO Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 relative transform hover:scale-105 transition-transform shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                  POPULAIRE
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-blue-100">Pour les PME en croissance</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">29</span>
                  <span className="text-blue-100 ml-2">CHF/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Jusqu'à 500 produits</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Clients illimités</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Jusqu'à 3 utilisateurs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Factures PDF personnalisées</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Variantes de produits</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Analytics avancés</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Bons cadeaux</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white font-medium">Support prioritaire</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-50 font-bold transition-colors shadow-lg"
              >
                Essayer Pro gratuitement
              </Link>
            </div>

            {/* BUSINESS Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business</h3>
                <p className="text-gray-600">Pour les équipes et multi-sites</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">69</span>
                  <span className="text-gray-600 ml-2">CHF/mois</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Tout de Pro +</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Jusqu'à 10 utilisateurs</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Segmentations automatiques</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Gestion d'équipe avancée</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rapports personnalisés</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">API & Intégrations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Support téléphonique</span>
                </li>
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 font-semibold transition-colors"
              >
                Essayer Business
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-12">
            Tous les plans incluent 14 jours d'essai gratuit • Sans engagement • Annulation en un clic
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Des PME suisses qui ont transformé leur gestion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "OperisCloud a révolutionné notre façon de gérer la boutique. En 2 mois, on a gagné 10h par semaine sur la facturation !"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">ML</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Marie Leclerc</p>
                  <p className="text-sm text-gray-600">Boutique de mode, Lausanne</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Interface super intuitive ! Mon équipe a adopté l'outil en quelques jours sans formation. Les rapports sont précis."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jean Dupont</p>
                  <p className="text-sm text-gray-600">Garage automobile, Genève</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Le meilleur rapport qualité-prix pour un ERP complet. Support réactif et mises à jour régulières. Je recommande !"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">SM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sophie Martin</p>
                  <p className="text-sm text-gray-600">Salon de beauté, Fribourg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Puis-je vraiment commencer gratuitement ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Oui ! Notre plan gratuit vous permet de tester OperisCloud sans limite de temps et sans carte bancaire. Vous pouvez upgrader à tout moment vers un plan payant.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Mes données sont-elles sécurisées ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Absolument. Nous utilisons un chiffrement SSL, des sauvegardes quotidiennes automatiques et respectons le RGPD. Vos données sont hébergées en Europe sur des serveurs sécurisés.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Puis-je importer mes données existantes ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Oui. Vous pouvez importer vos produits, clients et autres données via fichier Excel. Le format est simple et documenté. Notre support peut vous accompagner si besoin.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Puis-je changer de plan à tout moment ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement et la facturation est ajustée au prorata.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Y a-t-il des frais cachés ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Non. Le prix affiché est le prix final. Pas de frais de setup, pas de frais de sortie. Vous payez uniquement votre abonnement mensuel.
              </p>
            </details>

            <details className="group bg-gray-50 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-gray-900">
                Le support est-il inclus ?
                <ArrowRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Oui. Tous les plans incluent le support par email en français. Les plans Pro et Business ont un support prioritaire. Business inclut également le support téléphonique.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6))]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Prêt à transformer votre gestion ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines de PME suisses qui font confiance à OperisCloud
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 font-bold text-lg shadow-2xl hover:scale-105 transition-all"
            >
              Démarrer gratuitement
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/10 font-bold text-lg transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
          <p className="mt-8 text-blue-100">
            ✓ Sans carte bancaire ✓ Configuration en 5 min ✓ Annulation en un clic
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Logo & Description */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">O</span>
                  </div>
                  <span className="text-2xl font-bold text-white">OperisCloud</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  La solution de gestion ERP complète pour PME, artisans et commerçants suisses.
                  Simplifiez votre quotidien, développez votre activité.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-gray-400">Hébergement sécurisé en Suisse</span>
                </div>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-white font-semibold mb-4">Produit</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="#features" className="hover:text-white transition-colors">
                      Fonctionnalités
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-white transition-colors">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link href="/sign-up" className="hover:text-white transition-colors">
                      Essai gratuit
                    </Link>
                  </li>
                  <li>
                    <Link href="/sign-in" className="hover:text-white transition-colors">
                      Connexion
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-white font-semibold mb-4">Légal</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/legal/terms" className="hover:text-white transition-colors">
                      CGU
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/privacy" className="hover:text-white transition-colors">
                      Confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/mentions" className="hover:text-white transition-colors">
                      Mentions légales
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} OperisCloud. Tous droits réservés.
                </p>
                <p className="text-sm text-gray-500 mt-4 md:mt-0">
                  Développé avec ❤️ en Suisse par Gabriel Rossi
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
