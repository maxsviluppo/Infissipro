import React from 'react';

interface WindowPreviewProps {
  width: number;
  height: number;
  colorId?: string;
  openingId?: string;
}

const WindowPreview: React.FC<WindowPreviewProps> = ({ 
  width, 
  height, 
  colorId = 'white', 
  openingId = 'battente' 
}) => {
  // 1. Calculate Aspect Ratio to fit in a square box (e.g., 200x200 viewbox)
  const MAX_SIZE = 200;
  const ratio = width / height;
  
  let drawW, drawH;
  if (ratio > 1) {
    // Wider than tall
    drawW = MAX_SIZE;
    drawH = MAX_SIZE / ratio;
  } else {
    // Taller than wide
    drawH = MAX_SIZE;
    drawW = MAX_SIZE * ratio;
  }

  // Center the window in the SVG
  const startX = (240 - drawW) / 2; // 240 is total SVG width including padding
  const startY = (240 - drawH) / 2;

  // 2. Resolve Colors
  const getColorStyle = (id: string) => {
    switch (id) {
      case 'anthracite': return { fill: '#374151', stroke: '#1f2937' }; // Slate-700
      case 'oak': return { fill: '#8B4513', stroke: '#5D2906' }; // SaddleBrown
      case 'white': 
      default: return { fill: '#f8fafc', stroke: '#cbd5e1' }; // Slate-50
    }
  };

  const frameStyle = getColorStyle(colorId);
  const glassStyle = { fill: '#e0f2fe', opacity: 0.6 }; // Light blue transparent

  // 3. Frame Thickness
  const frameThickness = 12; // Visual units

  return (
    <div className="flex flex-col items-center justify-center py-4 select-none">
      <svg 
        width="100%" 
        height="240" 
        viewBox="0 0 240 240" 
        className="drop-shadow-md"
      >
        {/* --- DIMENSION LINES --- */}
        {/* Width Line (Bottom) */}
        <line 
          x1={startX} y1={startY + drawH + 15} 
          x2={startX + drawW} y2={startY + drawH + 15} 
          stroke="#94a3b8" strokeWidth="1" 
        />
        <line x1={startX} y1={startY + drawH + 10} x2={startX} y2={startY + drawH + 20} stroke="#94a3b8" strokeWidth="1"/>
        <line x1={startX + drawW} y1={startY + drawH + 10} x2={startX + drawW} y2={startY + drawH + 20} stroke="#94a3b8" strokeWidth="1"/>
        <text 
          x={startX + drawW / 2} y={startY + drawH + 28} 
          textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold"
        >
          {width} cm
        </text>

        {/* Height Line (Left) */}
        <line 
          x1={startX - 15} y1={startY} 
          x2={startX - 15} y2={startY + drawH} 
          stroke="#94a3b8" strokeWidth="1" 
        />
        <line x1={startX - 20} y1={startY} x2={startX - 10} y2={startY} stroke="#94a3b8" strokeWidth="1"/>
        <line x1={startX - 20} y1={startY + drawH} x2={startX - 10} y2={startY + drawH} stroke="#94a3b8" strokeWidth="1"/>
        <text 
          x={startX - 20} y={startY + drawH / 2} 
          textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold"
          transform={`rotate(-90, ${startX - 20}, ${startY + drawH / 2})`}
        >
          {height} cm
        </text>

        {/* --- WINDOW FRAME (Outer) --- */}
        <rect 
          x={startX} y={startY} 
          width={drawW} height={drawH} 
          fill={frameStyle.fill} stroke={frameStyle.stroke} strokeWidth="2"
          rx="2"
        />

        {/* --- SASHES / OPENING TYPES logic --- */}
        
        {/* Logic for SCORREVOLE (Sliding) - 2 vertical panes */}
        {openingId === 'scorrevole' ? (
           <>
             {/* Left Pane */}
             <rect 
               x={startX + frameThickness} 
               y={startY + frameThickness} 
               width={(drawW / 2) - frameThickness} 
               height={drawH - (frameThickness * 2)} 
               fill={glassStyle.fill} stroke={frameStyle.stroke} strokeWidth="2"
               opacity={glassStyle.opacity}
             />
             {/* Right Pane (slightly overlapping) */}
             <rect 
               x={startX + (drawW / 2)} 
               y={startY + frameThickness} 
               width={(drawW / 2) - frameThickness} 
               height={drawH - (frameThickness * 2)} 
               fill={glassStyle.fill} stroke={frameStyle.stroke} strokeWidth="2"
               opacity={glassStyle.opacity}
             />
             {/* Middle Vertical Frame Bar */}
             <line 
                x1={startX + (drawW / 2)} y1={startY} 
                x2={startX + (drawW / 2)} y2={startY + drawH} 
                stroke={frameStyle.stroke} strokeWidth="4" 
             />
             {/* Arrow for Sliding */}
             <path 
                d={`M ${startX + frameThickness + 10} ${startY + drawH/2} L ${startX + drawW/2 - 10} ${startY + drawH/2}`} 
                stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)"
             />
           </>
        ) : (
           /* Default Single Pane (Battente, Vasistas, Fixed) */
           <rect 
             x={startX + frameThickness} 
             y={startY + frameThickness} 
             width={drawW - (frameThickness * 2)} 
             height={drawH - (frameThickness * 2)} 
             fill={glassStyle.fill} stroke={frameStyle.stroke} strokeWidth="1"
             opacity={glassStyle.opacity}
           />
        )}

        {/* --- OPENING LINES (Architectural Triangles) --- */}
        {/* Dashed lines indicating the hinge side (vertex points to handle/open side) */}
        
        {openingId === 'battente' && (
           /* Triangle pointing Right (Hinge is on Left) */
           <path 
             d={`M ${startX + frameThickness} ${startY + frameThickness} L ${startX + drawW - frameThickness} ${startY + drawH/2} L ${startX + frameThickness} ${startY + drawH - frameThickness}`}
             fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" opacity="0.7"
           />
        )}

        {openingId === 'vasistas' && (
            /* Triangle pointing Up (Hinge is on Bottom) */
            <path 
              d={`M ${startX + frameThickness} ${startY + drawH - frameThickness} L ${startX + drawW/2} ${startY + frameThickness} L ${startX + drawW - frameThickness} ${startY + drawH - frameThickness}`}
              fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" opacity="0.7"
            />
        )}


        {/* --- DETAILED HANDLES --- */}
        
        {openingId === 'battente' && (
           /* Vertical Handle on the Right */
           <g transform={`translate(${startX + drawW - (frameThickness * 2.5)}, ${startY + (drawH / 2) - 15})`}>
              {/* Base Plate */}
              <rect x="0" y="0" width="8" height="30" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              {/* Lever (L-shape) */}
              <path d="M 4 8 L 4 18 L -10 20" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
           </g>
        )}

        {openingId === 'vasistas' && (
           /* Horizontal Handle on the Top */
           <g transform={`translate(${startX + (drawW / 2) - 15}, ${startY + frameThickness + 2})`}>
              {/* Base Plate */}
              <rect x="0" y="0" width="30" height="8" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              {/* Lever (Knob style) */}
              <path d="M 8 4 L 22 4 L 22 14" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
           </g>
        )}
        
        {/* Reflection effect on glass */}
        <path 
           d={`M ${startX + frameThickness * 2} ${startY + drawH - frameThickness * 3} L ${startX + drawW - frameThickness * 3} ${startY + frameThickness * 2}`} 
           stroke="white" strokeWidth="20" strokeOpacity="0.3" 
           clipPath={`inset(0 0 0 0)`} 
        />

        {/* Defs for arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

      </svg>
      <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          Vista Interna (Schema)
      </div>
    </div>
  );
};

export default WindowPreview;