import React from 'react';
import { QuoteState } from '../types';
import { WIZARD_STEPS } from '../constants';
import { Ruler, ShoppingCart, Calculator, ArrowRight } from 'lucide-react';
import WindowPreview from './WindowPreview';

interface SidebarProps {
  quoteState: QuoteState;
  currentStepIndex: number;
}

const Sidebar: React.FC<SidebarProps> = ({ quoteState, currentStepIndex }) => {
  // Helper to calculate estimated price
  const calculateTotal = () => {
    const area = (quoteState.width * quoteState.height) / 10000; // m2
    let total = 0;

    // Base calculation logic (simplified for demo)
    // Formula: (Area * MaterialBase) + (Area * GlassBase) + OpeningBase + ColorBase
    
    const mat = quoteState.selections['material'];
    const glass = quoteState.selections['glass'];
    const opening = quoteState.selections['opening'];
    const color = quoteState.selections['color'];

    if (mat) total += area * mat.basePrice * mat.priceMultiplier;
    if (glass) total += area * glass.basePrice * glass.priceMultiplier;
    if (opening) total += opening.basePrice * opening.priceMultiplier;
    if (color) total += color.basePrice;

    return Math.round(total);
  };

  const totalPrice = calculateTotal();
  const area = ((quoteState.width * quoteState.height) / 10000).toFixed(2);

  // Extract needed IDs for preview
  const colorId = quoteState.selections['color']?.id;
  const openingId = quoteState.selections['opening']?.id;

  return (
    <div className="sticky top-6 flex h-fit flex-col gap-6 rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <ShoppingCart className="h-5 w-5 text-brand-600" />
          Il tuo Progetto
        </h2>
        <p className="text-sm text-slate-500 mt-1">Riepilogo configurazione</p>
      </div>

      {/* DYNAMIC PREVIEW */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <WindowPreview 
            width={quoteState.width} 
            height={quoteState.height} 
            colorId={colorId}
            openingId={openingId}
        />
      </div>

      {/* Dimensions Summary Text */}
      <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600 font-medium">
                    {quoteState.width} x {quoteState.height} cm
                </span>
           </div>
           <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
               {area} m²
           </span>
      </div>

      {/* Selections List */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dettagli Scelti</h3>
        <div className="flex flex-col gap-2">
          {WIZARD_STEPS.filter(step => step.type === 'selection').map((step) => {
            const selected = quoteState.selections[step.id];
            
            // Don't show future steps if we aren't there yet, unless already selected
            const stepIndex = WIZARD_STEPS.findIndex(s => s.id === step.id);
            if (stepIndex > currentStepIndex && !selected) return null;

            return (
              <div key={step.id} className="flex items-start justify-between border-b border-slate-50 pb-2 last:border-0">
                <span className="text-sm text-slate-500">{step.title}</span>
                <span className={`text-sm font-medium text-right max-w-[120px] truncate ${selected ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                  {selected ? selected.name : 'In attesa...'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Price */}
      <div className="mt-2 rounded-xl bg-brand-900 p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-brand-200 text-sm font-medium">Stima Totale</span>
          <Calculator className="h-4 w-4 text-brand-300" />
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">€ {totalPrice.toLocaleString('it-IT')}</span>
            <span className="text-xs text-brand-300 font-light">+ IVA</span>
        </div>
      </div>

      <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-700 active:bg-brand-800">
        Salva Preventivo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="text-center">
         <p className="text-[10px] text-slate-400">
             *Il prezzo è indicativo e potrebbe variare in fase di sopralluogo.
         </p>
      </div>

    </div>
  );
};

export default Sidebar;