import Link from 'next/link';

export const metadata = {
  title: 'Politique de Confidentialité - OperisCloud',
  description: 'Politique de confidentialité et protection des données de OperisCloud',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              La protection de vos données personnelles est une priorité pour OperisCloud. Cette politique de confidentialité
              explique quelles données nous collectons, comment nous les utilisons, les protégeons et quels sont vos droits.
            </p>
            <p className="text-gray-700">
              OperisCloud est édité par Gabriel Rossi et respecte le Règlement Général sur la Protection des Données (RGPD)
              ainsi que la Loi fédérale suisse sur la protection des données (LPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsable du traitement</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Responsable du traitement :</strong> Gabriel Rossi</p>
              <p className="text-gray-700 mb-2"><strong>Service :</strong> OperisCloud</p>
              <p className="text-gray-700"><strong>Contact :</strong> privacy@businesshub.ch</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Données collectées</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Données d'identification</h3>
            <p className="text-gray-700 mb-2">Lors de la création de votre compte, nous collectons :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Nom de l'entreprise</li>
              <li>Mot de passe (crypté)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Données d'entreprise</h3>
            <p className="text-gray-700 mb-2">Vous pouvez volontairement fournir :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Informations de l'entreprise (adresse, téléphone, site web)</li>
              <li>Numéro de TVA</li>
              <li>Numéro d'enregistrement de l'entreprise</li>
              <li>Coordonnées bancaires (IBAN, BIC) pour les factures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Données de contenu</h3>
            <p className="text-gray-700 mb-2">Les données que vous saisissez dans l'application :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Produits (noms, prix, stocks, descriptions)</li>
              <li>Clients (noms, emails, adresses, téléphones)</li>
              <li>Commandes et transactions</li>
              <li>Dépenses et revenus (module Finance)</li>
              <li>Notes et commentaires</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Données de paiement</h3>
            <p className="text-gray-700 mb-4">
              Les informations de carte bancaire sont collectées et traitées directement par notre prestataire de paiement
              <strong> Stripe</strong>. Nous ne stockons jamais vos données de carte bancaire complètes sur nos serveurs.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.5 Données d'utilisation</h3>
            <p className="text-gray-700 mb-2">Nous collectons automatiquement :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Adresse IP</li>
              <li>Type et version du navigateur</li>
              <li>Pages visitées et actions effectuées</li>
              <li>Dates et heures de connexion</li>
              <li>Informations sur l'appareil utilisé</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.6 Cookies</h3>
            <p className="text-gray-700 mb-2">Nous utilisons des cookies pour :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Maintenir votre session de connexion</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser l'utilisation du service (analytics)</li>
              <li>Améliorer la sécurité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Finalités du traitement</h2>
            <p className="text-gray-700 mb-2">Nous utilisons vos données pour :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Fournir le service :</strong> Créer et gérer votre compte, exécuter vos commandes</li>
              <li><strong>Facturation :</strong> Traiter les paiements, émettre des factures</li>
              <li><strong>Communication :</strong> Vous envoyer des notifications importantes, répondre à vos demandes</li>
              <li><strong>Amélioration :</strong> Analyser l'utilisation pour améliorer nos fonctionnalités</li>
              <li><strong>Sécurité :</strong> Détecter et prévenir la fraude, protéger contre les abus</li>
              <li><strong>Marketing :</strong> Vous informer de nouvelles fonctionnalités (avec votre consentement)</li>
              <li><strong>Conformité :</strong> Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Base légale du traitement</h2>
            <p className="text-gray-700 mb-2">Nous traitons vos données sur la base de :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Exécution du contrat :</strong> Pour fournir les services que vous avez demandés</li>
              <li><strong>Obligations légales :</strong> Pour respecter les lois fiscales et comptables</li>
              <li><strong>Intérêts légitimes :</strong> Pour améliorer notre service et assurer la sécurité</li>
              <li><strong>Consentement :</strong> Pour les communications marketing (que vous pouvez retirer à tout moment)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partage des données</h2>
            <p className="text-gray-700 mb-4">
              Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons partager vos données avec :
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Prestataires de services</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Clerk :</strong> Authentification et gestion des utilisateurs</li>
              <li><strong>Stripe :</strong> Traitement des paiements</li>
              <li><strong>Neon Database :</strong> Hébergement de la base de données (PostgreSQL)</li>
              <li><strong>Vercel :</strong> Hébergement de l'application</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Tous nos prestataires sont contractuellement tenus de protéger vos données et de les utiliser
              uniquement selon nos instructions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Obligations légales</h3>
            <p className="text-gray-700 mb-4">
              Nous pouvons divulguer vos données si la loi l'exige, en réponse à une procédure judiciaire valide,
              ou pour protéger nos droits, votre sécurité ou celle d'autrui.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Transferts internationaux</h2>
            <p className="text-gray-700 mb-4">
              Vos données peuvent être transférées et stockées dans des centres de données situés dans l'Union Européenne
              et aux États-Unis. Lorsque vos données sont transférées hors de Suisse ou de l'UE, nous nous assurons
              que des garanties appropriées sont en place (clauses contractuelles types, Privacy Shield, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Durée de conservation</h2>
            <p className="text-gray-700 mb-2">Nous conservons vos données :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Compte actif :</strong> Tant que votre compte est actif</li>
              <li><strong>Après suppression :</strong> 30 jours pour permettre une récupération</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale suisse)</li>
              <li><strong>Logs de sécurité :</strong> 12 mois maximum</li>
            </ul>
            <p className="text-gray-700">
              Après ces périodes, vos données sont supprimées de manière sécurisée ou anonymisées à des fins statistiques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sécurité des données</h2>
            <p className="text-gray-700 mb-2">Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Chiffrement des données en transit (HTTPS/TLS) et au repos</li>
              <li>Authentification forte et gestion des accès</li>
              <li>Sauvegardes automatiques régulières</li>
              <li>Surveillance et détection des intrusions</li>
              <li>Tests de sécurité réguliers</li>
              <li>Formation du personnel sur la protection des données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Vos droits</h2>
            <p className="text-gray-700 mb-4">
              Conformément au RGPD et à la LPD suisse, vous disposez des droits suivants :
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.1 Droit d'accès</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.2 Droit de rectification</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez corriger ou mettre à jour vos données inexactes ou incomplètes directement depuis
              les paramètres de votre compte ou en nous contactant.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.3 Droit à l'effacement</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez demander la suppression de vos données personnelles, sous réserve de certaines exceptions
              légales (par exemple, conservation des données de facturation).
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.4 Droit à la limitation</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.5 Droit à la portabilité</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez exporter vos données dans un format structuré et lisible par machine depuis les paramètres
              de votre compte.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.6 Droit d'opposition</h3>
            <p className="text-gray-700 mb-4">
              Vous pouvez vous opposer au traitement de vos données à des fins de marketing direct à tout moment.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">10.7 Droit de retirer le consentement</h3>
            <p className="text-gray-700 mb-4">
              Lorsque le traitement est basé sur votre consentement, vous pouvez le retirer à tout moment.
            </p>

            <p className="text-gray-700 font-semibold">
              Pour exercer vos droits, contactez-nous à : privacy@businesshub.ch
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Données des clients de nos utilisateurs</h2>
            <p className="text-gray-700 mb-4">
              En tant qu'utilisateur de OperisCloud, vous pouvez collecter et traiter des données sur vos propres clients.
              Dans ce cas, <strong>vous êtes le responsable du traitement</strong> de ces données et OperisCloud agit
              en tant que <strong>sous-traitant</strong>.
            </p>
            <p className="text-gray-700 mb-4">
              Vous devez :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Obtenir le consentement de vos clients pour collecter leurs données</li>
              <li>Informer vos clients de l'utilisation de OperisCloud comme sous-traitant</li>
              <li>Respecter toutes les lois applicables en matière de protection des données</li>
              <li>Répondre aux demandes de vos clients concernant leurs données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Mineurs</h2>
            <p className="text-gray-700">
              OperisCloud n'est pas destiné aux personnes de moins de 18 ans. Nous ne collectons pas sciemment
              de données personnelles auprès de mineurs. Si vous pensez qu'un mineur nous a fourni des données,
              veuillez nous contacter immédiatement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modifications de cette politique</h2>
            <p className="text-gray-700">
              Nous pouvons modifier cette politique de confidentialité de temps à autre. En cas de changement important,
              nous vous en informerons par email et/ou par une notification dans l'application. La date de "Dernière mise à jour"
              en haut de cette page indique quand la politique a été révisée pour la dernière fois.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Réclamations</h2>
            <p className="text-gray-700 mb-4">
              Si vous estimez que vos droits en matière de protection des données ont été violés, vous pouvez
              déposer une réclamation auprès de :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Préposé fédéral à la protection des données et à la transparence (PFPDT)</strong></p>
              <p className="text-gray-700 mb-2">Feldeggweg 1</p>
              <p className="text-gray-700 mb-2">CH - 3003 Berne</p>
              <p className="text-gray-700">Email : info@edoeb.admin.ch</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact</h2>
            <p className="text-gray-700 mb-2">
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
            </p>
            <ul className="list-none text-gray-700 space-y-2">
              <li>Email : privacy@businesshub.ch</li>
              <li>Responsable de la protection des données : Gabriel Rossi</li>
            </ul>
          </section>

          <section className="border-t pt-8">
            <p className="text-sm text-gray-600">
              En utilisant OperisCloud, vous acceptez cette politique de confidentialité et le traitement
              de vos données personnelles comme décrit ci-dessus.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
