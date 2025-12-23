import Link from 'next/link';

export const metadata = {
  title: 'Conditions Générales d\'Utilisation - OperisCloud',
  description: 'Conditions générales d\'utilisation de OperisCloud',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Conditions Générales d'Utilisation
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Présentation du service</h2>
            <p className="text-gray-700 mb-4">
              OperisCloud est une plateforme SaaS (Software as a Service) de gestion d'entreprise éditée par Gabriel Rossi,
              permettant aux entreprises de gérer leurs stocks, ventes, clients et finances de manière centralisée.
            </p>
            <p className="text-gray-700">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme OperisCloud
              et définissent les droits et obligations de l'utilisateur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptation des conditions</h2>
            <p className="text-gray-700 mb-4">
              L'accès et l'utilisation de OperisCloud impliquent l'acceptation pleine et entière des présentes CGU.
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce service.
            </p>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs seront informés
              de toute modification par email et devront accepter les nouvelles conditions pour continuer à utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Création de compte</h3>
            <p className="text-gray-700 mb-4">
              Pour utiliser OperisCloud, vous devez créer un compte en fournissant des informations exactes et complètes.
              Vous êtes responsable de la confidentialité de vos identifiants de connexion.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Conditions d'éligibilité</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Vous devez avoir au moins 18 ans</li>
              <li>Vous devez être légalement autorisé à représenter l'entreprise pour laquelle vous créez un compte</li>
              <li>Vous ne devez pas avoir été précédemment banni de la plateforme</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Sécurité du compte</h3>
            <p className="text-gray-700">
              Vous êtes responsable de toutes les activités effectuées via votre compte. En cas de suspicion d'utilisation
              non autorisée, vous devez immédiatement nous en informer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Plans et tarification</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Plans disponibles</h3>
            <p className="text-gray-700 mb-4">
              OperisCloud propose plusieurs plans d'abonnement : FREE, PRO et BUSINESS. Les caractéristiques
              et limites de chaque plan sont détaillées sur notre page de tarification.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Période d'essai</h3>
            <p className="text-gray-700 mb-4">
              Un essai gratuit de 14 jours est disponible pour les plans payants. Aucune carte bancaire n'est requise
              pour démarrer l'essai. À la fin de la période d'essai, vous pouvez choisir de souscrire à un abonnement
              payant ou de revenir au plan gratuit.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Paiement</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Les paiements sont traités de manière sécurisée via Stripe</li>
              <li>Les abonnements sont facturés mensuellement ou annuellement selon votre choix</li>
              <li>Les prix sont indiqués en CHF (Francs Suisses) et incluent la TVA le cas échéant</li>
              <li>Le renouvellement est automatique sauf annulation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Remboursement</h3>
            <p className="text-gray-700">
              Vous pouvez annuler votre abonnement à tout moment. En cas d'annulation, vous conservez l'accès
              à votre plan payant jusqu'à la fin de la période de facturation en cours. Aucun remboursement
              au prorata n'est effectué pour les périodes non utilisées.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Utilisation du service</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Licence d'utilisation</h3>
            <p className="text-gray-700 mb-4">
              Nous vous accordons une licence limitée, non exclusive, non transférable et révocable pour utiliser
              OperisCloud conformément aux présentes CGU et aux limites de votre plan d'abonnement.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Restrictions d'utilisation</h3>
            <p className="text-gray-700 mb-2">Vous vous engagez à ne pas :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Utiliser le service à des fins illégales ou frauduleuses</li>
              <li>Tenter d'accéder aux données d'autres utilisateurs</li>
              <li>Copier, modifier, distribuer ou créer des œuvres dérivées du service</li>
              <li>Utiliser des robots, scrapers ou autres moyens automatisés pour accéder au service</li>
              <li>Transmettre des virus, malwares ou autres codes malveillants</li>
              <li>Dépasser les limites de votre plan d'abonnement</li>
              <li>Revendre ou sous-licencier l'accès au service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Disponibilité du service</h3>
            <p className="text-gray-700">
              Nous nous efforçons de maintenir la disponibilité du service 24/7, mais nous ne garantissons pas
              une disponibilité ininterrompue. Des maintenances programmées peuvent nécessiter une indisponibilité
              temporaire, dont nous vous informerons à l'avance dans la mesure du possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos données</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Propriété des données</h3>
            <p className="text-gray-700 mb-4">
              Vous conservez tous les droits de propriété sur les données que vous saisissez dans OperisCloud
              (produits, clients, commandes, etc.). Nous ne revendiquons aucun droit de propriété sur vos données.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Sauvegarde et sécurité</h3>
            <p className="text-gray-700 mb-4">
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos données. Des sauvegardes
              automatiques sont effectuées régulièrement. Cependant, nous vous recommandons d'exporter régulièrement
              vos données importantes.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Suppression des données</h3>
            <p className="text-gray-700">
              En cas de résiliation de votre compte, vos données seront conservées pendant 30 jours avant suppression
              définitive. Vous pouvez demander une suppression immédiate en nous contactant.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              OperisCloud, son code source, son design, ses logos et tous les éléments qui le composent sont
              la propriété exclusive de Gabriel Rossi et sont protégés par les lois sur la propriété intellectuelle.
            </p>
            <p className="text-gray-700">
              Toute reproduction, représentation, modification ou utilisation non autorisée est strictement interdite
              et pourra donner lieu à des poursuites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation de responsabilité</h2>
            <p className="text-gray-700 mb-4">
              Le service est fourni "tel quel" sans garantie d'aucune sorte. Dans les limites autorisées par la loi :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Nous ne garantissons pas que le service sera exempt d'erreurs ou ininterrompu</li>
              <li>Nous ne sommes pas responsables des pertes de données dues à des facteurs hors de notre contrôle</li>
              <li>Notre responsabilité totale ne dépassera pas le montant payé au cours des 12 derniers mois</li>
              <li>Nous ne sommes pas responsables des dommages indirects, accessoires ou consécutifs</li>
            </ul>
            <p className="text-gray-700">
              Vous utilisez le service à vos propres risques et êtes responsable de maintenir des sauvegardes
              appropriées de vos données critiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Résiliation</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Résiliation par l'utilisateur</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre compte ou en nous contactant.
              La résiliation prendra effet à la fin de votre période de facturation en cours.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Résiliation par OperisCloud</h3>
            <p className="text-gray-700 mb-2">
              Nous nous réservons le droit de suspendre ou résilier votre compte en cas de :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Violation des présentes CGU</li>
              <li>Non-paiement des frais d'abonnement</li>
              <li>Activité frauduleuse ou illégale</li>
              <li>Utilisation abusive du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications du service</h2>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment,
              avec ou sans préavis. Nous nous efforcerons de vous informer à l'avance des modifications majeures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Droit applicable et juridiction</h2>
            <p className="text-gray-700 mb-4">
              Les présentes CGU sont régies par le droit suisse. En cas de litige, et à défaut de résolution amiable,
              les tribunaux suisses seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
            <p className="text-gray-700 mb-2">
              Pour toute question concernant ces CGU, vous pouvez nous contacter :
            </p>
            <ul className="list-none text-gray-700 space-y-2">
              <li>Par email : support@businesshub.ch</li>
              <li>Responsable : Gabriel Rossi</li>
            </ul>
          </section>

          <section className="border-t pt-8">
            <p className="text-sm text-gray-600">
              En utilisant OperisCloud, vous reconnaissez avoir lu, compris et accepté les présentes
              Conditions Générales d'Utilisation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
