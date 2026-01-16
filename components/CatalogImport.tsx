import React, { useState } from 'react';
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { Loader2, AlertCircle, Scale, CheckCircle2 } from 'lucide-react';
import { ProductOption } from '../types';

interface CatalogImportProps {
  onImportSuccess: (categoryKey: string, newOptions: ProductOption[]) => void;
}

type ImportStatus = 'idle' | 'reading' | 'analyzing' | 'success' | 'error';

const CatalogImport: React.FC<CatalogImportProps> = ({ onImportSuccess }) => {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset logic
    setError(null);
    setFileName(file.name);
    setStatus('idle');

    if (file.type !== 'application/pdf') {
      setError("Il file deve essere un PDF.");
      setStatus('error');
      return;
    }

    // Check file size (Increased to 30MB)
    const MAX_SIZE_MB = 30;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File troppo grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Il limite è ${MAX_SIZE_MB}MB.`);
      setStatus('error');
      return;
    }

    try {
      // STEP 1: Reading File
      setStatus('reading');
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (!result) {
              reject(new Error("Lettura file fallita (file vuoto?)"));
              return;
          }
          // Handle cases where result might not include the prefix or be different
          const parts = result.split(',');
          resolve(parts.length > 1 ? parts[1] : result);
        };
        reader.onerror = () => reject(new Error("Errore nella lettura del file locale."));
        reader.readAsDataURL(file);
      });

      // STEP 2: AI Analysis
      setStatus('analyzing');

      // Access env var directly as string replacement
      const apiKey = process.env.API_KEY;
      
      // Debug check (visible in console)
      if (!apiKey || apiKey.includes("undefined")) {
        console.error("API Key mancante o non valida:", apiKey);
        throw new Error("API Key mancante su Vercel. Controlla le impostazioni del progetto.");
      }

      const ai = new GoogleGenAI({ apiKey });

      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                artCode: { type: Type.STRING, description: "Article code (e.g., PL 2001)" },
                description: { type: Type.STRING, description: "Short description" },
                weight: { type: Type.NUMBER, description: "Weight in gr/m" },
                type: { 
                    type: Type.STRING, 
                    description: "Type: 'frame' or 'sash'",
                    enum: ['frame', 'sash', 'other']
                }
              },
              required: ["artCode", "description", "weight", "type"]
            }
          }
        },
        required: ["items"]
      };

      // Using gemini-3-flash-preview as requested for efficient, free-tier compatible testing
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data
              }
            },
            {
              text: `Analyze this window catalog PDF.
            Find the technical data tables (often "ELENCO PROFILI").
            Extract 10-20 main profiles (Frames/Telai and Sashes/Ante).
            
            Return JSON with:
            - artCode (e.g. PL 2001)
            - description
            - weight (gr/m)
            - type ('frame' if Telaio, 'sash' if Anta, else 'other')`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        }
      });

      const resultText = response.text;
      if (!resultText) throw new Error("Nessuna risposta dall'IA. Riprova o il PDF potrebbe non essere leggibile.");

      const data = JSON.parse(resultText);
      
      const frames: ProductOption[] = [];
      const sashes: ProductOption[] = [];
      const COST_PER_KG = 15; 

      if (!data.items || data.items.length === 0) {
          throw new Error("Nessun dato trovato nel PDF. Assicurati che contenga tabelle tecniche.");
      }

      data.items.forEach((item: any) => {
        const isFrame = item.type === 'frame';
        const isSash = item.type === 'sash';
        const estimatedPrice = Math.round((item.weight / 1000) * COST_PER_KG * (isFrame ? 4 : 5)); 

        const newOption: ProductOption = {
            id: item.artCode.replace(/\s+/g, '-').toLowerCase(),
            name: `${item.artCode} - ${item.description}`,
            description: `Peso: ${item.weight} gr/m.`,
            imageUrl: `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(item.artCode)}`,
            basePrice: estimatedPrice,
            priceMultiplier: 1,
            code: item.artCode,
            weight: item.weight,
            categoryType: item.type as any
        };

        if (isFrame) frames.push(newOption);
        else if (isSash) sashes.push(newOption);
      });

      // STEP 3: Success
      setStatus('success');
      
      if (frames.length > 0) onImportSuccess('material', frames);
      if (sashes.length > 0) setTimeout(() => onImportSuccess('opening', sashes), 500);

      setTimeout(() => {
          setStatus('idle');
          setFileName("");
      }, 4000);

    } catch (err: any) {
      console.error("Import failed:", err);
      // Clean up error message for display
      let msg = err.message || "Errore sconosciuto.";
      if (msg.includes("API Key")) msg = "Errore Configurazione: API Key Vercel mancante.";
      if (msg.includes("400")) msg = "Errore richiesta AI (400). Il PDF potrebbe essere corrotto o illeggibile.";
      if (msg.includes("500")) msg = "Errore server AI. Riprova più tardi.";
      
      setError(msg);
      setStatus('error');
    }
  };

  // UI STATE RENDERERS
  const renderContent = () => {
    switch (status) {
        case 'reading':
            return (
                <>
                    <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                    <span className="text-brand-700">Lettura PDF...</span>
                </>
            );
        case 'analyzing':
            return (
                <>
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    <span className="text-purple-700">Gemini analizza...</span>
                </>
            );
        case 'success':
            return (
                <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-bold">Importato!</span>
                </>
            );
        case 'error':
            return (
                <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-700">Errore</span>
                </>
            );
        default: // idle
            return (
                <>
                    <Scale className="h-4 w-4" />
                    <span>Carica Listino (Flash)</span>
                </>
            );
    }
  };

  const getButtonClass = () => {
    switch (status) {
        case 'reading': return 'bg-brand-50 border-brand-200 cursor-wait';
        case 'analyzing': return 'bg-purple-50 border-purple-200 cursor-wait';
        case 'success': return 'bg-green-50 border-green-200';
        case 'error': return 'bg-red-50 border-red-200';
        default: return 'bg-slate-900 text-white border-transparent hover:bg-slate-800 shadow-md';
    }
  };

  return (
    <div className="relative group">
       <input 
          type="file" 
          accept="application/pdf" 
          onChange={handleFileUpload} 
          disabled={status !== 'idle' && status !== 'error'}
          id="catalog-upload"
          className="hidden"
       />
       
       <label 
         htmlFor="catalog-upload"
         className={`
           flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 cursor-pointer overflow-hidden
           ${getButtonClass()}
         `}
       >
          {renderContent()}
       </label>

       {/* Detailed status message floating below if active */}
       {(status === 'analyzing' || status === 'reading') && (
         <div className="absolute top-full mt-2 left-0 right-0 text-center w-full min-w-[150px] -translate-x-1/4 md:translate-x-0">
             <span className="text-[10px] text-slate-500 bg-white/95 px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 whitespace-nowrap block">
                {status === 'reading' ? 'Lettura file in corso...' : 'L\'IA sta leggendo il catalogo...'}
             </span>
         </div>
       )}

       {/* Error Message */}
       {error && (
         <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-red-50 border border-red-100 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2 text-red-800">
               <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
               <div className="break-words">
                   <p className="font-bold text-xs">Errore</p>
                   <p className="text-[11px] opacity-90 leading-tight mt-0.5">{error}</p>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default CatalogImport;