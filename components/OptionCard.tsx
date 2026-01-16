import React from 'react';
import { ProductOption } from '../types';
import { CheckCircle2, Scale, Tag } from 'lucide-react';

interface OptionCardProps {
  option: ProductOption;
  isSelected: boolean;
  onSelect: (option: ProductOption) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(option)}
      className={`
        group relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ease-in-out flex flex-col h-full
        ${
          isSelected
            ? 'border-brand-600 bg-brand-50 shadow-xl scale-[1.02]'
            : 'border-slate-200 bg-white shadow-sm hover:border-brand-300 hover:shadow-md'
        }
      `}
    >
      {/* Selection Indicator */}
      <div
        className={`absolute right-3 top-3 z-10 transition-opacity duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="rounded-full bg-white p-0.5 shadow-sm">
          <CheckCircle2 className="h-6 w-6 text-brand-600 fill-brand-100" />
        </div>
      </div>

      {/* Image Area */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
         <img
          src={option.imageUrl}
          alt={option.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 p-4"
          loading="lazy"
        />
        {/* Technical Overlay Badge */}
        {option.code && (
            <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {option.code}
            </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className={`font-bold text-base leading-tight ${isSelected ? 'text-brand-700' : 'text-slate-800'}`}>
            {option.name}
          </h3>
        </div>
        
        <p className="text-xs text-slate-500 mb-3 flex-grow line-clamp-3">
          {option.description}
        </p>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
            {option.weight ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    <Scale className="h-3 w-3" />
                    <span className="font-mono font-medium">{option.weight} gr/m</span>
                </div>
            ) : <div></div>}
            
            {option.basePrice > 0 && (
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-brand-200 text-brand-800' : 'bg-green-50 text-green-700'}`}>
                    ~{option.basePrice}€
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default OptionCard;