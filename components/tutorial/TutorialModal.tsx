'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  link?: string;
  linkText?: string;
}

interface TutorialModalProps {
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Bienvenue sur OperisCloud!',
    description: 'Nous sommes ravis de vous accueillir. Ce tutoriel rapide vous aidera à démarrer et à comprendre les fonctionnalités principales de votre nouvelle plateforme de gestion.',
  },
  {
    title: 'Gérez votre inventaire',
    description: 'Ajoutez vos produits avec leurs prix, stocks et codes-barres. Vous pouvez également créer des variantes (tailles, couleurs, etc.) pour chaque produit.',
    link: '/inventory',
    linkText: 'Voir l\'inventaire',
  },
  {
    title: 'Configurez les variantes',
    description: 'Allez dans Paramètres > Variantes pour définir vos options de variantes (Taille, Couleur, Matière, etc.). Cela vous permettra de créer des produits avec plusieurs déclinaisons.',
    link: '/settings?tab=variants',
    linkText: 'Configurer les variantes',
  },
  {
    title: 'Paramètres de vente',
    description: 'Configurez vos méthodes de paiement, la TVA par défaut, les frais de livraison et le préfixe de vos numéros de commande dans les paramètres de vente.',
    link: '/settings?tab=sales',
    linkText: 'Paramètres de vente',
  },
  {
    title: 'Gestion des clients',
    description: 'Créez des fiches clients complètes avec leurs informations de contact, historique d\'achats et notes. Segmentez-les pour un meilleur suivi.',
    link: '/customers',
    linkText: 'Voir les clients',
  },
  {
    title: 'Créez des commandes',
    description: 'Créez facilement des commandes en sélectionnant vos produits, clients, et en appliquant des remises ou des bons cadeaux. Le système gère automatiquement le stock.',
    link: '/sales/new',
    linkText: 'Nouvelle commande',
  },
  {
    title: 'Bons cadeaux',
    description: 'Créez et gérez des bons cadeaux pour vos clients. Ils peuvent être utilisés directement lors de la création d\'une commande.',
    link: '/giftcards',
    linkText: 'Voir les bons cadeaux',
  },
  {
    title: 'Suivez vos finances',
    description: 'Enregistrez vos dépenses et consultez vos revenus, bénéfices et statistiques détaillées sur les pages Finance et Analytics.',
    link: '/finance',
    linkText: 'Voir les finances',
  },
  {
    title: 'Vous êtes prêt!',
    description: 'Vous connaissez maintenant les bases de BusinessHub. N\'hésitez pas à explorer toutes les fonctionnalités. Vous pouvez toujours accéder aux paramètres pour personnaliser votre expérience.',
  },
];

export default function TutorialModal({ onComplete }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);
  const router = useRouter();

  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    await onComplete();
  };

  const handleComplete = async () => {
    await onComplete();
  };

  const handleLinkClick = (link: string) => {
    // Mark as completed but navigate to the link
    onComplete();
    router.push(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Guide de démarrage</h2>
            <button
              onClick={handleSkip}
              disabled={isSkipping}
              className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep ? 'bg-white' : 'bg-blue-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">
                {currentStep + 1}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {step.description}
            </p>
          </div>

          {step.link && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => handleLinkClick(step.link!)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                {step.linkText || 'En savoir plus'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} / {tutorialSteps.length}
            </span>

            <button
              onClick={handleNext}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {isLastStep ? (
                <>
                  Terminer
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
