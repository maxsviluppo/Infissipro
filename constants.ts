import { CategoryStep, WizardStep } from './types';

// DATA ENTRY AREA
// Add your products here. This structure drives the entire UI.

export const CATEGORIES: Record<string, CategoryStep> = {
  material: {
    id: 'material',
    title: 'Materiale Profilo',
    subtitle: 'Scegli il materiale principale per la struttura',
    options: [
      {
        id: 'pvc',
        name: 'PVC Premium',
        description: 'Eccellente isolamento termico, economico e durevole.',
        imageUrl: 'https://picsum.photos/id/10/400/300', // Placeholder
        basePrice: 150, // Price per sqm
        priceMultiplier: 1.0,
      },
      {
        id: 'wood',
        name: 'Legno Lamellare',
        description: 'Eleganza naturale, perfetto per ambienti classici.',
        imageUrl: 'https://picsum.photos/id/16/400/300',
        basePrice: 280,
        priceMultiplier: 1.2,
      },
      {
        id: 'alu',
        name: 'Alluminio Taglio Termico',
        description: 'Minimalista, resistente e moderno. Massima luce.',
        imageUrl: 'https://picsum.photos/id/20/400/300',
        basePrice: 350,
        priceMultiplier: 1.15,
      },
      {
        id: 'alu-wood',
        name: 'Legno / Alluminio',
        description: 'Il calore del legno dentro, la resistenza dell\'alluminio fuori.',
        imageUrl: 'https://picsum.photos/id/24/400/300',
        basePrice: 450,
        priceMultiplier: 1.3,
      },
    ],
  },
  opening: {
    id: 'opening',
    title: 'Tipologia Apertura',
    subtitle: 'Come si deve aprire la tua finestra?',
    options: [
      {
        id: 'fixed',
        name: 'Fisso',
        description: 'Non apribile. Ideale per vetrine o punti luce.',
        imageUrl: 'https://picsum.photos/id/42/400/300',
        basePrice: 0,
        priceMultiplier: 0.8,
      },
      {
        id: 'battente',
        name: 'Anta a Battente',
        description: 'Apertura classica interna.',
        imageUrl: 'https://picsum.photos/id/48/400/300',
        basePrice: 50,
        priceMultiplier: 1.0,
      },
      {
        id: 'vasistas',
        name: 'Vasistas / Ribalta',
        description: 'Apertura superiore per areazione controllata.',
        imageUrl: 'https://picsum.photos/id/56/400/300',
        basePrice: 80,
        priceMultiplier: 1.1,
      },
      {
        id: 'scorrevole',
        name: 'Scorrevole',
        description: 'Salvaspazio, ideale per grandi vetrate.',
        imageUrl: 'https://picsum.photos/id/60/400/300',
        basePrice: 200,
        priceMultiplier: 1.5,
      },
    ],
  },
  glass: {
    id: 'glass',
    title: 'Vetrata',
    subtitle: 'Scegli le performance del vetro',
    options: [
      {
        id: 'double',
        name: 'Doppio Vetro Standard',
        description: 'Camera d\'aria standard (Ug 1.1).',
        imageUrl: 'https://picsum.photos/id/114/400/300',
        basePrice: 50,
        priceMultiplier: 1.0,
      },
      {
        id: 'triple',
        name: 'Triplo Vetro',
        description: 'Massimo isolamento termico (Ug 0.6).',
        imageUrl: 'https://picsum.photos/id/128/400/300',
        basePrice: 120,
        priceMultiplier: 1.2,
      },
      {
        id: 'acoustic',
        name: 'Vetro Acustico',
        description: 'Ideale per zone trafficate e rumorose.',
        imageUrl: 'https://picsum.photos/id/180/400/300',
        basePrice: 100,
        priceMultiplier: 1.1,
      },
    ],
  },
  color: {
    id: 'color',
    title: 'Finitura e Colore',
    subtitle: 'L\'estetica conta',
    options: [
      {
        id: 'white',
        name: 'Bianco Massa',
        description: 'Standard, pulito e luminoso.',
        imageUrl: 'https://picsum.photos/id/250/400/300',
        basePrice: 0,
        priceMultiplier: 1.0,
      },
      {
        id: 'anthracite',
        name: 'Grigio Antracite',
        description: 'Moderno ed elegante, effetto satinato.',
        imageUrl: 'https://picsum.photos/id/260/400/300',
        basePrice: 30,
        priceMultiplier: 1.05,
      },
      {
        id: 'oak',
        name: 'Effetto Quercia',
        description: 'Pellicola effetto legno naturale.',
        imageUrl: 'https://picsum.photos/id/270/400/300',
        basePrice: 50,
        priceMultiplier: 1.1,
      },
    ],
  },
};

// Define the order of steps in the application
export const WIZARD_STEPS: WizardStep[] = [
  { id: 'dimensions', type: 'dimensions', title: 'Misure' },
  { id: 'material', type: 'selection', title: 'Materiali', categoryData: CATEGORIES.material },
  { id: 'opening', type: 'selection', title: 'Apertura', categoryData: CATEGORIES.opening },
  { id: 'glass', type: 'selection', title: 'Vetri', categoryData: CATEGORIES.glass },
  { id: 'color', type: 'selection', title: 'Colori', categoryData: CATEGORIES.color },
];
