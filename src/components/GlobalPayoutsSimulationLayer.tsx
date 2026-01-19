import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
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
  delay: number;
};

// Distribute nodes vertically this time to fit under Connect
const RECIPIENTS: RecipientNode[] = [
  { id: 'supplier-a', flag: '🇨🇳', currency: 'CNY', label: 'Supplier A', countryCode: 'CN', xOffset: 0, yOffset: 55, delay: 0 },
  { id: 'contractor-b', flag: '🇬🇧', currency: 'GBP', label: 'Contractor B', countryCode: 'UK', xOffset: 0, yOffset: 155, delay: 0.1 },
  { id: 'vendor-c', flag: '🇪🇺', currency: 'EUR', label: 'Vendor C', countryCode: 'EU', xOffset: 0, yOffset: 255, delay: 0.2 },
];

const getGradient = () => {
  const baseColor = '#cbd5e1'; // Slate 300 (Grey)
  return [baseColor, baseColor]; // Simple grey base line
};

export const GlobalPayoutsSimulationLayer = ({ isActive }: GlobalPayoutsSimulationLayerProps) => {

  // Configuration
  const CARD_BOTTOM_Y = STAGE.cardTopY + 380;
  
  // Connect Section is roughly at X = Center + 350 (starts at 1050)
  // Connect Section ends roughly at Y = 710 (Top 310 + Height 400)
  
  const SECTION_LEFT = (STAGE.width / 4) * 3; // 1050px - Aligned with grid line
  const SECTION_TOP = 536; // Just below Connect
  
  // Pipeline Routing (Bus Style)
  // PIPE_Y is now the vertical center of the middle recipient (Contractor B)
  const PIPE_Y = SECTION_TOP + RECIPIENTS[1].yOffset + 24; 
  const INTERNAL_X = SECTION_LEFT + 40; // Split point
  
  const getNodePath = (node: RecipientNode) => {
      const startX = STAGE.cardCenterX;
      const startY = CARD_BOTTOM_Y;
      
      const targetX = INTERNAL_X + 24; // Entering the node
      const targetY = SECTION_TOP + node.yOffset + 24; // Center of node
      
      const cornerRadius = 20;
      
      const p1 = { x: startX, y: startY };
      const p2 = { x: startX, y: PIPE_Y }; 
      const p3 = { x: INTERNAL_X, y: PIPE_Y }; 
      const p4 = { x: INTERNAL_X, y: targetY }; 
      const p5 = { x: targetX, y: targetY }; 
      
      // Check if middle node (straight horizontal)
      if (Math.abs(targetY - PIPE_Y) < 1) {
          return `
            M ${p1.x} ${p1.y}
            L ${p1.x} ${p2.y - cornerRadius}
            Q ${p1.x} ${p2.y} ${p1.x + cornerRadius} ${p2.y}
            L ${p5.x} ${p5.y}
          `;
      }
      
      const verticalDirection = targetY > PIPE_Y ? 1 : -1;

      return `
        M ${p1.x} ${p1.y}
        L ${p1.x} ${p2.y - cornerRadius}
        Q ${p1.x} ${p2.y} ${p1.x + cornerRadius} ${p2.y}
        L ${p3.x - cornerRadius} ${p3.y}
        Q ${p3.x} ${p3.y} ${p3.x} ${p3.y + (cornerRadius * verticalDirection)}
        L ${p4.x} ${p4.y - (cornerRadius * verticalDirection)}
        Q ${p4.x} ${p4.y} ${p4.x + cornerRadius} ${p4.y}
        L ${p5.x} ${p5.y}
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
             {/* Container Box (Dashed) */}
             <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 336 }}
                exit={{ opacity: 0, height: 0 }}
                className="absolute border-2 border-dashed rounded-3xl bg-slate-50/50"
                style={{
                    left: '74.9%', // Aligned with 4th vertical grid line (overlaps grey line)
                    top: SECTION_TOP,
                    width: '25.1%', // 25% of stage width to reach the right edge
                    borderColor: 'rgba(17, 239, 227, 0.3)', // Teal at low opacity
                }}
             >
                 <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-[#11EFE3] border border-cyan-100 px-2 py-1 rounded-full bg-white shadow-sm">
                     <Globe className="w-3 h-3" />
                     Global Payouts
                 </div>
             </motion.div>

             {/* Lines */}
             <svg className="absolute inset-0 w-full h-full overflow-visible">
                <defs>
                    {RECIPIENTS.map((node) => {
                        const colors = getGradient();
                        return (
                            <linearGradient 
                                key={`grad-${node.id}`} 
                                id={`grad-${node.id}`} 
                                gradientUnits="userSpaceOnUse"
                                x1={STAGE.cardCenterX} y1={CARD_BOTTOM_Y}
                                x2={SECTION_LEFT + 100} y2={SECTION_TOP + 200}
                            >
                                <stop offset="0%" stopColor={colors[0]} />
                                <stop offset="100%" stopColor={colors[1]} /> 
                            </linearGradient>
                        );
                    })}
                </defs>
                
                {RECIPIENTS.map((node) => {
                   const d = getNodePath(node);
                   
                   return (
                       <g key={node.id}>
                           {/* Base Line */}
                           <motion.path
                              d={d}
                              fill="none"
                              stroke={`url(#grad-${node.id})`}
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.4 }}
                              transition={{ duration: 0.8, delay: node.delay }}
                           />
                           
                           {/* Dash Stream */}
                           <motion.path
                              d={d}
                              fill="none"
                              stroke="#0073E6"
                              strokeWidth={2}
                              strokeDasharray="4 120" 
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ strokeDashoffset: 0, opacity: 0 }}
                              animate={{ strokeDashoffset: -124, opacity: 1 }}
                              transition={{
                                  strokeDashoffset: {
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    ease: "linear"
                                  },
                                  opacity: { duration: 0.3, delay: node.delay + 0.2 }
                              }}
                           />
                       </g>
                   );
                })}
             </svg>

             {/* Nodes - Vertical List */}
             {RECIPIENTS.map((node) => {
                 const INTERNAL_X = SECTION_LEFT + 40;
                 const targetX = INTERNAL_X + 24;
                 const targetY = SECTION_TOP + node.yOffset;
                 
                 return (
                     <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + node.delay }}
                        className="absolute flex items-center gap-3 cursor-pointer group"
                        style={{
                            left: targetX,
                            top: targetY,
                            width: 220, 
                            height: 48,
                        }}
                     >
                        {/* Flag Avatar */}
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm relative z-10">
                            {node.flag}
                             {/* Status Dot */}
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        {/* Label */}
                         <div className="flex flex-col leading-tight flex-1">
                             <div className="flex justify-between items-center">
                                 <span className="text-sm font-semibold text-slate-700">{node.label}</span>
                             </div>
                             <span className="text-xs text-slate-400">Wire • Next Day</span>
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
