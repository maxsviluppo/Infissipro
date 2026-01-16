// Defines the structure of a single selectable option (e.g., "PVC", "White", "Double Glass")
export interface ProductOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number; // Base price per unit or per square meter depending on context
  priceMultiplier: number; // Multiplier for complexity
  // Technical Data Added
  code?: string; // e.g., "PL 2001"
  weight?: number; // e.g., 897 (gr/m)
  categoryType?: 'frame' | 'sash' | 'accessory' | 'other';
}

// Defines a category/step in the wizard (e.g., "Material", "Opening Type")
export interface CategoryStep {
  id: string;
  title: string;
  subtitle: string;
  options: ProductOption[];
}

// The state of the current user configuration
export interface QuoteState {
  width: number; // cm
  height: number; // cm
  selections: Record<string, ProductOption | null>; // Map of CategoryID -> SelectedOption
}

export type StepType = 'dimensions' | 'selection';

export interface WizardStep {
  id: string;
  type: StepType;
  title: string;
  categoryData?: CategoryStep;
}