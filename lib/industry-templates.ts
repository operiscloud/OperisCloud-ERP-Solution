import { IndustryTemplate } from '@/types';

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'fashion',
    name: 'Mode & Vêtements',
    icon: '👕',
    description: 'Boutiques de vêtements, stands de marché, créateurs de mode',
    modules: ['inventory', 'crm', 'sales', 'finance', 'giftcards', 'analytics'],
    productTypes: [
      {
        name: 'Vêtement',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Taille',
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
          },
          {
            name: 'Couleur',
            values: ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Rose'],
          },
        ],
        fields: ['Matière', 'Marque', 'Collection', 'Saison'],
      },
      {
        name: 'Accessoire',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Taille',
            values: ['Unique', 'S', 'M', 'L'],
          },
          {
            name: 'Couleur',
            values: ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu'],
          },
        ],
        fields: ['Matière', 'Marque'],
      },
    ],
    salesChannels: [
      { id: 'market', name: 'Stand/Marché', icon: '🏪', active: true },
      { id: 'online', name: 'Site web', icon: '🌐', active: true },
      { id: 'instagram', name: 'Instagram', icon: '📱', active: true },
      { id: 'shop', name: 'Boutique physique', icon: '🏬', active: false },
      { id: 'wholesale', name: 'Grossiste', icon: '📦', active: false },
    ],
    expenseCategories: [
      { id: 'PRODUCTION', name: 'Production/Fabrication', color: '#3b82f6' },
      { id: 'TISSUS', name: 'Tissus & Matières premières', color: '#8b5cf6' },
      { id: 'MARKETING', name: 'Marketing & Publicité', color: '#ec4899' },
      { id: 'STAND', name: 'Location stand/marché', color: '#f59e0b' },
      { id: 'LOGISTIQUE', name: 'Logistique & Livraison', color: '#10b981' },
      { id: 'PACKAGING', name: 'Emballage', color: '#6366f1' },
      { id: 'PHOTO', name: 'Photos produits', color: '#14b8a6' },
      { id: 'OTHER', name: 'Autres dépenses', color: '#6b7280' },
    ],
    defaultCurrency: 'CHF',
    defaultLanguage: 'fr',
  },

  {
    id: 'auto_repair',
    name: 'Garage / Mécanique',
    icon: '🔧',
    description: 'Garages automobiles, ateliers mécaniques, carrosserie',
    modules: ['inventory', 'crm', 'sales', 'finance', 'analytics'],
    productTypes: [
      {
        name: 'Pièce détachée',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Marque véhicule',
            values: ['VW', 'Audi', 'BMW', 'Mercedes', 'Renault', 'Peugeot', 'Citroën', 'Autre'],
          },
        ],
        fields: ['Référence', 'Fabricant', 'Compatibilité', 'Modèle'],
      },
      {
        name: 'Prestation mécanique',
        type: 'SERVICE',
        unit: 'hour',
        fields: ['Durée estimée', 'Taux horaire', 'Difficulté'],
      },
      {
        name: 'Consommable',
        type: 'PHYSICAL',
        fields: ['Volume', 'Marque'],
      },
    ],
    salesChannels: [
      { id: 'workshop', name: 'Atelier', icon: '🔧', active: true },
      { id: 'roadside', name: 'Dépannage', icon: '🚗', active: true },
      { id: 'phone', name: 'Téléphone', icon: '📞', active: true },
      { id: 'online', name: 'En ligne', icon: '🌐', active: false },
    ],
    expenseCategories: [
      { id: 'PIECES', name: 'Pièces détachées', color: '#3b82f6' },
      { id: 'OUTILLAGE', name: 'Outillage & Équipement', color: '#8b5cf6' },
      { id: 'LOYER_ATELIER', name: 'Loyer atelier', color: '#f59e0b' },
      { id: 'CONSOMMABLES', name: 'Huiles & Consommables', color: '#10b981' },
      { id: 'ASSURANCES', name: 'Assurances', color: '#ef4444' },
      { id: 'FORMATION', name: 'Formation technique', color: '#14b8a6' },
      { id: 'UTILITIES', name: 'Électricité & Chauffage', color: '#f97316' },
      { id: 'OTHER', name: 'Autres dépenses', color: '#6b7280' },
    ],
    defaultCurrency: 'EUR',
    defaultLanguage: 'fr',
  },

  {
    id: 'beauty',
    name: 'Beauté & Bien-être',
    icon: '💅',
    description: 'Salons de coiffure, instituts de beauté, spas, esthétique',
    modules: ['crm', 'sales', 'finance', 'analytics', 'giftcards'],
    productTypes: [
      {
        name: 'Prestation beauté',
        type: 'SERVICE',
        unit: 'session',
        fields: ['Durée', 'Praticien', 'Zone'],
      },
      {
        name: 'Produit de soin',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Format',
            values: ['30ml', '50ml', '100ml', '250ml', '500ml'],
          },
        ],
        fields: ['Marque', 'Type de peau'],
      },
    ],
    salesChannels: [
      { id: 'salon', name: 'Salon', icon: '💇', active: true },
      { id: 'home', name: 'Domicile', icon: '🏠', active: true },
      { id: 'online', name: 'Vente en ligne', icon: '🌐', active: false },
    ],
    expenseCategories: [
      { id: 'PRODUITS', name: 'Produits & Cosmétiques', color: '#ec4899' },
      { id: 'LOYER_SALON', name: 'Loyer salon', color: '#f59e0b' },
      { id: 'MATERIEL', name: 'Matériel professionnel', color: '#8b5cf6' },
      { id: 'FORMATION', name: 'Formation & Certifications', color: '#14b8a6' },
      { id: 'MARKETING', name: 'Marketing & Communication', color: '#3b82f6' },
      { id: 'UTILITIES', name: 'Électricité & Eau', color: '#f97316' },
      { id: 'OTHER', name: 'Autres dépenses', color: '#6b7280' },
    ],
    defaultCurrency: 'CHF',
    defaultLanguage: 'fr',
  },

  {
    id: 'restaurant',
    name: 'Restauration',
    icon: '🍽️',
    description: 'Restaurants, food trucks, traiteurs, boulangeries',
    modules: ['inventory', 'sales', 'finance', 'analytics'],
    productTypes: [
      {
        name: 'Plat',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Taille',
            values: ['Petit', 'Moyen', 'Grand'],
          },
        ],
        fields: ['Catégorie', 'Allergènes', 'Temps de préparation'],
      },
      {
        name: 'Boisson',
        type: 'PHYSICAL',
        variants: [
          {
            name: 'Format',
            values: ['25cl', '33cl', '50cl', '75cl', '1L'],
          },
        ],
        fields: ['Type', 'Alcool'],
      },
    ],
    salesChannels: [
      { id: 'dinein', name: 'Sur place', icon: '🍽️', active: true },
      { id: 'takeaway', name: 'À emporter', icon: '🥡', active: true },
      { id: 'delivery', name: 'Livraison', icon: '🚚', active: true },
      { id: 'catering', name: 'Traiteur', icon: '🎉', active: false },
    ],
    expenseCategories: [
      { id: 'FOOD', name: 'Denrées alimentaires', color: '#10b981' },
      { id: 'BEVERAGES', name: 'Boissons', color: '#3b82f6' },
      { id: 'RENT', name: 'Loyer', color: '#f59e0b' },
      { id: 'STAFF', name: 'Personnel', color: '#8b5cf6' },
      { id: 'UTILITIES', name: 'Électricité & Gaz', color: '#f97316' },
      { id: 'EQUIPMENT', name: 'Équipement cuisine', color: '#6366f1' },
      { id: 'PACKAGING', name: 'Emballages', color: '#14b8a6' },
      { id: 'OTHER', name: 'Autres dépenses', color: '#6b7280' },
    ],
    defaultCurrency: 'EUR',
    defaultLanguage: 'fr',
  },

  {
    id: 'artisan',
    name: 'Artisanat',
    icon: '🎨',
    description: 'Artisans créateurs, céramique, bijoux, menuiserie',
    modules: ['inventory', 'crm', 'sales', 'finance', 'giftcards', 'analytics'],
    productTypes: [
      {
        name: 'Création artisanale',
        type: 'PHYSICAL',
        fields: ['Matériaux', 'Dimensions', 'Temps de fabrication', 'Pièce unique'],
      },
      {
        name: 'Atelier/Cours',
        type: 'SERVICE',
        unit: 'session',
        fields: ['Durée', 'Niveau', 'Nombre de participants'],
      },
    ],
    salesChannels: [
      { id: 'workshop', name: 'Atelier', icon: '🏭', active: true },
      { id: 'market', name: 'Marché', icon: '🏪', active: true },
      { id: 'online', name: 'En ligne', icon: '🌐', active: true },
      { id: 'gallery', name: 'Galerie', icon: '🖼️', active: false },
    ],
    expenseCategories: [
      { id: 'MATERIALS', name: 'Matières premières', color: '#8b5cf6' },
      { id: 'TOOLS', name: 'Outils & Équipement', color: '#3b82f6' },
      { id: 'RENT', name: 'Loyer atelier', color: '#f59e0b' },
      { id: 'PACKAGING', name: 'Emballage & Étiquettes', color: '#10b981' },
      { id: 'MARKETING', name: 'Marketing & Stands', color: '#ec4899' },
      { id: 'TRAINING', name: 'Formation', color: '#14b8a6' },
      { id: 'OTHER', name: 'Autres dépenses', color: '#6b7280' },
    ],
    defaultCurrency: 'CHF',
    defaultLanguage: 'fr',
  },

  {
    id: 'other',
    name: 'Autre activité',
    icon: '🏢',
    description: 'Configuration personnalisée pour votre activité',
    modules: ['inventory', 'crm', 'sales', 'finance', 'analytics'],
    productTypes: [
      {
        name: 'Produit',
        type: 'PHYSICAL',
        fields: [],
      },
      {
        name: 'Service',
        type: 'SERVICE',
        unit: 'hour',
        fields: [],
      },
    ],
    salesChannels: [
      { id: 'online', name: 'En ligne', icon: '🌐', active: true },
      { id: 'physical', name: 'Physique', icon: '🏪', active: true },
    ],
    expenseCategories: [
      { id: 'SUPPLIES', name: 'Fournitures', color: '#3b82f6' },
      { id: 'RENT', name: 'Loyer', color: '#f59e0b' },
      { id: 'MARKETING', name: 'Marketing', color: '#ec4899' },
      { id: 'UTILITIES', name: 'Charges', color: '#f97316' },
      { id: 'OTHER', name: 'Autres', color: '#6b7280' },
    ],
    defaultCurrency: 'EUR',
    defaultLanguage: 'fr',
  },
];

export function getIndustryTemplate(id: string): IndustryTemplate | undefined {
  return INDUSTRY_TEMPLATES.find((t) => t.id === id);
}

export function getDefaultIndustry(): IndustryTemplate {
  return INDUSTRY_TEMPLATES[0]; // Fashion as default
}
