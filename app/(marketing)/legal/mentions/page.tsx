import Link from 'next/link';

export const metadata = {
  title: 'Mentions Légales - OperisCloud',
  description: 'Mentions légales de OperisCloud',
};

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Mentions Légales
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Raison sociale :</strong> OperisCloud</p>
              <p className="text-gray-700"><strong>Responsable :</strong> Gabriel Rossi</p>
              <p className="text-gray-700"><strong>Statut :</strong> Entreprise individuelle</p>
              <p className="text-gray-700"><strong>Pays :</strong> Suisse</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Contact</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700"><strong>Email :</strong> contact@businesshub.ch</p>
              <p className="text-gray-700"><strong>Support :</strong> support@businesshub.ch</p>
              <p className="text-gray-700"><strong>Protection des données :</strong> privacy@businesshub.ch</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Application web :</strong></p>
                <p className="text-gray-700">Vercel Inc.</p>
                <p className="text-gray-700">340 S Lemon Ave #4133</p>
                <p className="text-gray-700">Walnut, CA 91789, États-Unis</p>
                <p className="text-gray-700">Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://vercel.com</a></p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Base de données :</strong></p>
                <p className="text-gray-700">Neon (PostgreSQL)</p>
                <p className="text-gray-700">Site web : <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://neon.tech</a></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              L'ensemble du contenu de ce site (structure, textes, logos, images, éléments graphiques, vidéos, sons, logiciels, etc.)
              est la propriété exclusive de OperisCloud et/ou de Gabriel Rossi, sauf mention contraire.
            </p>
            <p className="text-gray-700 mb-4">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site,
              quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
            </p>
            <p className="text-gray-700">
              Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée
              comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants
              du Code de Propriété Intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Marques</h2>
            <p className="text-gray-700">
              "OperisCloud" ainsi que tous les logos et marques reproduits sur le site sont déposés ou en cours de dépôt
              par OperisCloud et/ou Gabriel Rossi. Toute reproduction totale ou partielle de ces marques ou logos effectuée
              à partir des éléments du site sans l'autorisation expresse de OperisCloud est prohibée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Protection des données personnelles</h2>
            <p className="text-gray-700 mb-4">
              Les informations recueillies sur ce site font l'objet d'un traitement informatique destiné à la gestion
              des comptes utilisateurs et à la fourniture des services OperisCloud.
            </p>
            <p className="text-gray-700 mb-4">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la Loi fédérale suisse
              sur la protection des données (LPD), vous disposez d'un droit d'accès, de rectification, de suppression
              et d'opposition aux données personnelles vous concernant.
            </p>
            <p className="text-gray-700">
              Pour plus d'informations sur la protection de vos données personnelles, consultez notre{' '}
              <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Le site OperisCloud utilise des cookies pour améliorer l'expérience utilisateur, maintenir les sessions
              de connexion et analyser l'utilisation du site.
            </p>
            <p className="text-gray-700 mb-4">
              Types de cookies utilisés :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, sécurité)</li>
              <li><strong>Cookies de performance :</strong> Permettent d'améliorer le fonctionnement du site</li>
              <li><strong>Cookies analytiques :</strong> Mesurent l'audience et les statistiques de visite</li>
            </ul>
            <p className="text-gray-700">
              Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, cela peut affecter
              votre expérience sur le site et limiter certaines fonctionnalités.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Responsabilité</h2>
            <p className="text-gray-700 mb-4">
              OperisCloud s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
              Toutefois, OperisCloud ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations
              mises à disposition sur ce site.
            </p>
            <p className="text-gray-700 mb-4">
              OperisCloud ne saurait être tenu responsable :
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Des interruptions du site pour des opérations de maintenance ou pour toute autre raison</li>
              <li>Des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation du service</li>
              <li>Des virus qui pourraient infecter l'équipement informatique de l'utilisateur</li>
              <li>De l'indisponibilité temporaire ou totale du site</li>
              <li>Du contenu des sites externes vers lesquels le site pourrait rediriger</li>
            </ul>
            <p className="text-gray-700">
              L'utilisateur reconnaît utiliser le site à ses propres risques et sous sa responsabilité exclusive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Liens hypertextes</h2>
            <p className="text-gray-700 mb-4">
              Le site peut contenir des liens vers d'autres sites web. OperisCloud n'exerce aucun contrôle sur ces sites
              et décline toute responsabilité quant à leur contenu, leur disponibilité ou leur politique de confidentialité.
            </p>
            <p className="text-gray-700">
              La création de liens vers le site OperisCloud est autorisée sous réserve qu'ils ne portent pas atteinte
              à l'image de OperisCloud et qu'ils respectent les droits de propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Droit applicable</h2>
            <p className="text-gray-700 mb-4">
              Les présentes mentions légales sont régies par le droit suisse. Tout litige relatif à l'utilisation
              du site est soumis à la compétence exclusive des tribunaux suisses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Crédits</h2>
            <p className="text-gray-700 mb-4">
              <strong>Conception et développement :</strong> Gabriel Rossi
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Technologies utilisées :</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Next.js 15 - Framework React</li>
              <li>TypeScript - Langage de programmation</li>
              <li>Prisma - ORM pour la base de données</li>
              <li>PostgreSQL (Neon) - Base de données</li>
              <li>Clerk - Authentification</li>
              <li>Stripe - Paiements</li>
              <li>Tailwind CSS - Framework CSS</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Médiateur</h2>
            <p className="text-gray-700 mb-4">
              En cas de litige, et avant toute action en justice, vous pouvez contacter notre service client à l'adresse
              support@businesshub.ch pour tenter de résoudre le différend à l'amiable.
            </p>
            <p className="text-gray-700">
              Si aucune solution amiable n'est trouvée, vous pouvez saisir le médiateur de la consommation compétent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modifications</h2>
            <p className="text-gray-700">
              OperisCloud se réserve le droit de modifier à tout moment les présentes mentions légales.
              Les utilisateurs sont invités à les consulter régulièrement.
            </p>
          </section>

          <section className="border-t pt-8">
            <p className="text-sm text-gray-600">
              Date de dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
