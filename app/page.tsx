import Link from 'next/link';
import {
  ArrowRight, Check, Package, Users, TrendingUp, FileText, Gift, BarChart3,
  Zap, Shield, Clock, Globe, Sparkles, Star, MessageCircle, ArrowUpRight,
  UserPlus, Settings, Rocket, X
} from 'lucide-react';
import { Metadata } from 'next';
import ScannerShowcase from '@/components/landing/ScannerShowcase';
import MobileMenu from '@/components/landing/MobileMenu';

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
                className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm sm:text-base"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:shadow-lg hover:scale-105 font-semibold transition-all text-sm sm:text-base whitespace-nowrap"
              >
                Essai gratuit
              </Link>
              <MobileMenu />
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

      {/* Video Demo Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Découvrez OperisCloud en action
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Voyez comment ça fonctionne
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une démonstration rapide de 2 minutes pour comprendre comment OperisCloud simplifie votre gestion quotidienne
              </p>
            </div>

            {/* Video Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Placeholder for video - you can replace this with an actual video embed */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative group">
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center cursor-pointer">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-l-[20px] border-l-blue-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                  </div>
                </div>

                {/* Mockup screenshot */}
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                  <div className="text-center text-white">
                    <Package className="h-24 w-24 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-semibold opacity-75">Aperçu de l'interface OperisCloud</p>
                  </div>
                </div>
              </div>

              {/* Video caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <p className="font-semibold text-lg">Créez votre première facture en 30 secondes</p>
                <p className="text-sm text-gray-300">Voir la démo complète</p>
              </div>
            </div>

            {/* Features below video */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Interface intuitive</h3>
                <p className="text-sm text-gray-600">Aucune formation nécessaire pour commencer</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Gain de temps</h3>
                <p className="text-sm text-gray-600">Divisez par 3 le temps de gestion administrative</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Résultats mesurables</h3>
                <p className="text-sm text-gray-600">Tableaux de bord en temps réel</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 font-bold text-lg transition-all"
              >
                Démarrer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Aucune installation • Prêt en 2 minutes • Sans carte bancaire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100 font-medium">Entreprises actives</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100 font-medium">Factures générées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100 font-medium">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-blue-100 font-medium">
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
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

      {/* Scanner Showcase Section */}
      <ScannerShowcase />

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

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Démarrez en 3 étapes simples
            </h2>
            <p className="text-xl text-gray-600">
              Lancez votre gestion d'entreprise en quelques minutes
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2"></div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                {/* Step 1 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-500 hover:shadow-2xl transition-all relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                      <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      1
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      Créez votre compte
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Inscription gratuite en 2 minutes. Aucune carte bancaire requise. Confirmez votre email et c'est parti.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-500 hover:shadow-2xl transition-all relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      2
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      Configurez rapidement
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Importez vos données ou démarrez de zéro. Templates pré-configurés selon votre secteur d'activité.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="bg-white rounded-2xl p-8 border-2 border-green-100 hover:border-green-500 hover:shadow-2xl transition-all relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      3
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                      Lancez votre activité
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Commencez à créer vos factures, gérer vos stocks et suivre vos performances immédiatement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-xl hover:shadow-2xl hover:scale-105 font-bold text-lg transition-all"
              >
                Démarrer maintenant - C'est gratuit
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Aucune carte bancaire • Sans engagement • Support francophone
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi choisir OperisCloud plutôt que Bexio ?
            </h2>
            <p className="text-xl text-gray-600">
              Comparaison objective des fonctionnalités et tarifs
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="text-gray-600 font-semibold">Fonctionnalité</div>
                <div className="text-center">
                  <div className="font-bold text-blue-600 text-lg mb-1">OperisCloud</div>
                  <div className="text-sm text-gray-600">À partir de 0 CHF</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-700 text-lg mb-1">Bexio</div>
                  <div className="text-sm text-gray-600">À partir de 35 CHF/mois</div>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200">
                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Plan gratuit</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <X className="h-6 w-6 text-red-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Scanner de code-barres mobile</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500">Module payant</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Gestion des bons cadeaux</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <X className="h-6 w-6 text-red-500" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Rappels de paiement automatiques</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500">Module payant</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Interface moderne et intuitive</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500">Interface datée</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Facturation illimitée</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Check className="h-6 w-6 text-green-600 mx-auto" />
                      <span className="text-xs text-gray-500 block mt-1">Dès 29 CHF/mois</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Check className="h-6 w-6 text-green-600 mx-auto" />
                      <span className="text-xs text-gray-500 block mt-1">Dès 35 CHF/mois</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Support francophone inclus</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Hébergement en Suisse</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Multi-canaux de vente</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500">Limité</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Tableau de bord analytique</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex items-center justify-center">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center border-t border-gray-200">
                <p className="text-gray-700 mb-4 font-medium">
                  Économisez jusqu'à <span className="text-blue-600 font-bold text-xl">420 CHF/an</span> avec OperisCloud
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl hover:scale-105 font-bold text-lg transition-all"
                >
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  Sans carte bancaire • Migration depuis Bexio gratuite
                </p>
              </div>
            </div>

            {/* Note */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Comparaison basée sur les tarifs et fonctionnalités publics de Bexio en décembre 2024.
              <br />
              Nous respectons Bexio comme acteur du marché suisse.
            </p>
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
                  <span className="text-gray-700">Jusqu'à 25 clients</span>
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
      <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-200 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              <span className="text-sm font-semibold text-yellow-900">
                Note moyenne 4.9/5 sur 200+ avis
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Des PME suisses qui ont transformé leur gestion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-200 relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">"</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "OperisCloud a révolutionné notre façon de gérer la boutique. En 2 mois, on a gagné 10h par semaine sur la facturation !"
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold text-lg">ML</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Marie Leclerc</p>
                  <p className="text-sm text-gray-600">Boutique de mode</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Lausanne
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200 relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">"</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "Interface super intuitive ! Mon équipe a adopté l'outil en quelques jours sans formation. Les rapports sont précis."
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold text-lg">JD</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Jean Dupont</p>
                  <p className="text-sm text-gray-600">Garage automobile</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Genève
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-200 relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">"</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "Le meilleur rapport qualité-prix pour un ERP complet. Support réactif et mises à jour régulières. Je recommande !"
              </p>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sophie Martin</p>
                  <p className="text-sm text-gray-600">Salon de beauté</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Fribourg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-12 bg-white px-8 py-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">200+</div>
                  <div className="text-xs text-gray-600">Avis vérifiés</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">500+</div>
                  <div className="text-xs text-gray-600">Clients actifs</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
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
