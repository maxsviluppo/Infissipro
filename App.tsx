import React, { useState, useEffect } from 'react';
import { WIZARD_STEPS, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { QuoteState, ProductOption, CategoryStep } from './types';
import Sidebar from './components/Sidebar';
import OptionCard from './components/OptionCard';
import CatalogImport from './components/CatalogImport';
import { ArrowLeft, ArrowRight, Home, Check, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // State for Product Data - Modified to check LocalStorage first
  const [categories, setCategories] = useState<Record<string, CategoryStep>>(() => {
    try {
      const saved = localStorage.getItem('infissipro_categories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load from local storage", e);
    }
    return INITIAL_CATEGORIES;
  });

  // Save to LocalStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('infissipro_categories', JSON.stringify(categories));
  }, [categories]);

  const [quoteState, setQuoteState] = useState<QuoteState>({
    width: 120, // Default width
    height: 140, // Default height
    selections: {},
  });

  const currentStep = WIZARD_STEPS[currentStepIndex];
  // Determine current category data from state, not constants
  const currentCategoryData = currentStep.type === 'selection' && currentStep.categoryData 
    ? categories[currentStep.categoryData.id] 
    : undefined;

  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuoteState((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSelection = (option: ProductOption) => {
    if (!currentCategoryData) return;
    
    setQuoteState((prev) => ({
      ...prev,
      selections: {
        ...prev.selections,
        [currentCategoryData.id]: option,
      },
    }));
  };

  const handleImportSuccess = (categoryKey: string, newOptions: ProductOption[]) => {
    setCategories(prev => {
        const targetCategory = prev[categoryKey];
        if (!targetCategory) {
            alert(`Categoria '${categoryKey}' non trovata nel sistema.`);
            return prev;
        }

        // Merge or replace? Let's append for now, or replace if empty
        return {
            ...prev,
            [categoryKey]: {
                ...targetCategory,
                // Add new options to the beginning
                options: [...newOptions, ...targetCategory.options]
            }
        };
    });
    alert(`Importazione completata! ${newOptions.length} nuovi prodotti aggiunti alla categoria ${categoryKey}.`);
  };

  const handleResetCatalog = () => {
    if(confirm("Vuoi davvero ripristinare il catalogo originale? I dati importati verranno persi.")) {
        setCategories(INITIAL_CATEGORIES);
        localStorage.removeItem('infissipro_categories');
        window.location.reload();
    }
  };

  const nextStep = () => {
    // Validation
    if (currentStep.type === 'dimensions') {
        if (quoteState.width < 30 || quoteState.height < 30) {
            alert("Per favore inserisci dimensioni valide (min 30cm).");
            return;
        }
    } else if (currentStep.type === 'selection') {
        const catId = currentCategoryData?.id;
        if (catId && !quoteState.selections[catId]) {
             alert("Seleziona un'opzione per continuare.");
             return;
        }
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
        alert("Configurazione completata! Invio dati...");
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <div className="bg-brand-600 p-2 rounded-lg">
                    <Home className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Infissi<span className="text-brand-600">Pro</span>
                </h1>
            </div>
            
            {/* Catalog Import Button (Top Right) */}
            <div className="hidden md:flex items-center gap-4">
               <button 
                 onClick={handleResetCatalog}
                 className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                 title="Ripristina catalogo originale"
               >
                 <Trash2 className="h-3 w-3" /> Reset
               </button>
               <CatalogImport onImportSuccess={handleImportSuccess} />
            </div>

            {/* Progress Bar (Desktop) - simplified layout for header */}
            <div className="hidden lg:flex flex-col w-1/4">
                 <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                        className="h-full rounded-full bg-brand-600 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="w-10 md:hidden"></div> {/* Spacer for mobile alignment */}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Mobile Import Button */}
        <div className="md:hidden mb-6 flex flex-col items-center gap-2">
             <CatalogImport onImportSuccess={handleImportSuccess} />
             <button 
                 onClick={handleResetCatalog}
                 className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
               >
                 <Trash2 className="h-3 w-3" /> Ripristina Catalogo
             </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Sidebar (Summary) */}
          <aside className="w-full lg:w-1/3 order-2 lg:order-1">
             <Sidebar quoteState={quoteState} currentStepIndex={currentStepIndex} />
          </aside>

          {/* RIGHT COLUMN: Interactive Area */}
          <div className="w-full lg:w-2/3 order-1 lg:order-2">
            
            {/* Step Header */}
            <div className="mb-8">
                <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">
                    {currentStep.type === 'dimensions' ? 'Punto di partenza' : `Scegli ${currentStep.title}`}
                </span>
                <h2 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                    {currentStep.type === 'dimensions' ? 'Le tue Misure' : currentCategoryData?.title}
                </h2>
                <p className="mt-3 text-lg text-slate-500">
                    {currentStep.type === 'dimensions' 
                        ? 'Inserisci larghezza e altezza del vano finestra per iniziare il preventivo.' 
                        : currentCategoryData?.subtitle}
                </p>
            </div>

            {/* CONTENT AREA */}
            <div className="min-h-[400px]">
                
                {/* 1. DIMENSIONS INPUT UI */}
                {currentStep.type === 'dimensions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Larghezza (cm)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="width"
                                    min="30"
                                    max="500"
                                    className="block w-full rounded-xl border-slate-300 py-4 px-4 text-2xl font-bold text-slate-900 focus:border-brand-500 focus:ring-brand-500 bg-slate-50"
                                    value={quoteState.width}
                                    onChange={handleDimensionChange}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-slate-500">cm</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">Larghezza totale del vano murario.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Altezza (cm)</label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="height"
                                    min="30"
                                    max="500"
                                    className="block w-full rounded-xl border-slate-300 py-4 px-4 text-2xl font-bold text-slate-900 focus:border-brand-500 focus:ring-brand-500 bg-slate-50"
                                    value={quoteState.height}
                                    onChange={handleDimensionChange}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-slate-500">cm</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">Altezza dal davanzale all'architrave.</p>
                        </div>
                        
                        {/* Visual Helper */}
                        <div className="col-span-1 md:col-span-2 mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                             <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                 <Check className="h-5 w-5" />
                             </div>
                             <div>
                                 <h4 className="font-semibold text-blue-900">Consiglio dell'esperto</h4>
                                 <p className="text-sm text-blue-800">Prendi le misure in tre punti diversi (alto, centro, basso) e considera sempre la misura minore per sicurezza.</p>
                             </div>
                        </div>
                    </div>
                )}

                {/* 2. SELECTION GRID UI */}
                {currentStep.type === 'selection' && currentCategoryData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {currentCategoryData.options.map((option) => (
                            <OptionCard 
                                key={option.id}
                                option={option}
                                isSelected={quoteState.selections[currentCategoryData!.id]?.id === option.id}
                                onSelect={handleSelection}
                            />
                        ))}
                        
                        {/* Empty state for category if imported wrong */}
                        {currentCategoryData.options.length === 0 && (
                            <div className="col-span-2 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-slate-400">Nessuna opzione disponibile in questa categoria.</p>
                                <p className="text-xs text-brand-600 mt-2">Prova a importare un catalogo PDF.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors
                        ${currentStepIndex === 0 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                >
                    <ArrowLeft className="h-5 w-5" />
                    Indietro
                </button>

                <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-brand-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-xl transition-all active:scale-95"
                >
                    {isLastStep ? 'Concludi Preventivo' : 'Prosegui'}
                    {!isLastStep && <ArrowRight className="h-5 w-5" />}
                </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;