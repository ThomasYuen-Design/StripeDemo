import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE } from '@/config/products';

interface GlobalPayoutsSimulationLayerProps {
  isActive: boolean;
}

// Node Type Definition
type RecipientNode = {
  id: string;
  flag: string;
  currency: string;
  label: string;
  countryCode: string; // for color mapping
  xOffset: number; // Offset from center
  yOffset: number; // Vertical offset in container
};

// Distribute nodes vertically this time to fit under Connect
const RECIPIENTS: RecipientNode[] = [
  { id: 'supplier-a', flag: '🇨🇳', currency: 'CNY', label: 'Supplier A', countryCode: 'CN', xOffset: 0, yOffset: 40 },
  { id: 'contractor-b', flag: '🇬🇧', currency: 'GBP', label: 'Contractor B', countryCode: 'UK', xOffset: 0, yOffset: 100 },
  { id: 'vendor-c', flag: '🇪🇺', currency: 'EUR', label: 'Vendor C', countryCode: 'EU', xOffset: 0, yOffset: 160 },
];

const getGradient = (countryCode: string) => {
  switch (countryCode) {
    case 'CN': return ['#444444', '#D9241E']; // Dark Grey -> Red
    case 'UK': return ['#444444', '#00247D']; // Dark Grey -> Blue
    case 'EU': return ['#444444', '#003399']; // Dark Grey -> Euro Blue
    default: return ['#444444', '#635BFF'];
  }
};

export const GlobalPayoutsSimulationLayer = ({ isActive }: GlobalPayoutsSimulationLayerProps) => {

  // Configuration
  const CARD_BOTTOM_Y = STAGE.cardTopY + 380;
  
  // Connect Section is roughly at X = Center + 350 (starts at 1050)
  // Connect Section ends roughly at Y = 710 (Top 310 + Height 400)
  
  const SECTION_LEFT = STAGE.cardCenterX + 350; // Aligned with Connect
  const SECTION_TOP = 730; // Just below Connect
  
  // Pipeline Routing (Bus Style)
  // 1. Exit Card Bottom (Center)
  // 2. Drop slightly (to Pipe Level)
  // 3. Run Right to Section Left
  // 4. Drop to specific Node Y
  const PIPE_Y = SECTION_TOP + 10; // The horizontal "bus" line level
  
  const getNodePath = (node: RecipientNode) => {
      const startX = STAGE.cardCenterX;
      const startY = CARD_BOTTOM_Y;
      
      const targetX = SECTION_LEFT + 20; // Entering the box
      const targetY = SECTION_TOP + node.yOffset + 24; // Center of node (Height 50)
      
      // Path:
      // Start -> Down to PIPE_Y -> Right to SECTION_LEFT -> Down to TargetY -> Right to TargetX
      // Actually simpler: Start -> Down to PIPE_Y -> Right to SECTION_LEFT -> Down/Up? 
      // PIPE_Y is 740. Nodes are at 730+40=770+. So always Down.
      
      return `
        M ${startX} ${startY}
        L ${startX} ${PIPE_Y} 
        L ${SECTION_LEFT} ${PIPE_Y}
        L ${SECTION_LEFT} ${targetY}
        L ${targetX} ${targetY}
      `;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
             {/* Container Box (Dashed) - Vertical now */}
             <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 0.5, height: 220 }}
                className="absolute border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/30"
                style={{
                    left: SECTION_LEFT,
                    top: SECTION_TOP,
                    width: 280, // Matches Connect
                    // Height animated
                }}
             >
                 <div className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 rounded-full">
                     Global Payouts
                 </div>
             </motion.div>

             {/* Lines */}
             <svg className="absolute inset-0 w-full h-full overflow-visible">
                <defs>
                    {RECIPIENTS.map((node) => {
                        const colors = getGradient(node.countryCode);
                        return (
                            <linearGradient 
                                key={`grad-${node.id}`} 
                                id={`grad-${node.id}`} 
                                gradientUnits="userSpaceOnUse"
                                x1={STAGE.cardCenterX} y1={CARD_BOTTOM_Y}
                                x2={SECTION_LEFT + 100} y2={SECTION_TOP + 200}
                            >
                                <stop offset="0%" stopColor={colors[0]} />
                                <stop offset="70%" stopColor={colors[0]} /> 
                                <stop offset="100%" stopColor={colors[1]} /> 
                            </linearGradient>
                        );
                    })}
                </defs>
                
                {RECIPIENTS.map((node, i) => {
                   const d = getNodePath(node);
                   
                   return (
                       <g key={node.id}>
                           {/* Base Line */}
                           <motion.path
                              d={d}
                              fill="none"
                              stroke={`url(#grad-${node.id})`}
                              strokeWidth={3}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.8, delay: i * 0.15 }}
                           />
                           
                           {/* Dash Stream */}
                           <motion.path
                              d={d}
                              fill="none"
                              stroke="#FFF"
                              strokeWidth={3}
                              strokeDasharray="4 20" 
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ strokeDashoffset: 0, opacity: 0 }}
                              animate={{ strokeDashoffset: -24, opacity: 0.8 }}
                              transition={{
                                  strokeDashoffset: {
                                    duration: 0.4, 
                                    repeat: Infinity,
                                    ease: "linear"
                                  },
                                  opacity: { duration: 0.3 }
                              }}
                              style={{ mixBlendMode: 'overlay' }}
                           />
                       </g>
                   );
                })}
             </svg>

             {/* Nodes - Vertical List */}
             {RECIPIENTS.map((node, i) => {
                 const targetX = SECTION_LEFT + 20;
                 const targetY = SECTION_TOP + node.yOffset;
                 
                 return (
                     <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.15) }}
                        className="absolute flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm"
                        style={{
                            left: targetX,
                            top: targetY,
                            width: 240, // Fit inside 280 container
                            height: 50,
                        }}
                     >
                         <span className="text-2xl filter drop-shadow-sm opacity-100">{node.flag}</span>
                         <div className="flex flex-col leading-tight flex-1">
                             <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-700">{node.label}</span>
                                 <span className="text-[10px] font-mono bg-slate-100 px-1 rounded text-slate-500">{node.currency}</span>
                             </div>
                             <span className="text-[10px] text-slate-400">Wire Transfer • Next Day</span>
                         </div>
                     </motion.div>
                 );
             })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
