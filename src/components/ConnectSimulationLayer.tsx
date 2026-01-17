import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Car, User } from 'lucide-react';
import { STAGE } from '@/config/products';

interface ConnectSimulationLayerProps {
  isActive: boolean;
}

export const ConnectSimulationLayer = ({ isActive }: ConnectSimulationLayerProps) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Position: To the right of the central card
  // Card ends at center(700) + 300 = 1000.
  // Connect Box starts at 1050?
  const START_X = STAGE.cardCenterX + 300; 
  const CENTER_Y = 510;
  
  // Nodes Config
  const NODES = [
    { id: 'store', icon: Store, label: 'Merchant A', sub: 'Marketplace Seller', yOffset: -120, delay: 0 },
    { id: 'driver', icon: Car, label: 'Driver', sub: 'Gig Worker', yOffset: 0, delay: 0.1 },
    { id: 'creator', icon: User, label: 'Creator', sub: 'Freelancer', yOffset: 120, delay: 0.2 },
  ];

  // Colors
  // const CONNECT_COLOR = '#0048E5'; // Blurple
  // const TB_COLOR = '#635BFF';

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {isActive && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0"
          >
            {/* 1. The Container Box (Dashed) */}
            <motion.div
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: 280, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="absolute border-2 border-dashed rounded-3xl bg-slate-50/50 input-events-auto"
               style={{
                 left: START_X + 50, // Gap from card
                 top: CENTER_Y - 200,
                 height: 400,
                 borderColor: 'rgba(99, 91, 255, 0.3)', // Light blurple
               }}
            >
               <div className="absolute top-4 right-4 text-xs font-semibold text-[#635BFF] bg-[#635BFF]/10 px-2 py-1 rounded">
                 Connect
               </div>
            </motion.div>

            {/* 2. The Sprouting Lines & Nodes */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {NODES.map((node) => {
                 const start = { x: START_X, y: CENTER_Y };
                 // const end = { x: START_X + 130, y: CENTER_Y + node.yOffset }; // Unused
                 
                 // Box x = 1050. Width=280. Center X is approx 1190.
                 const nodeX = START_X + 50 + 60; // Left padding in box
                 const nodeY = CENTER_Y + node.yOffset;
                 
                 // Control Point for slight curve
                 const cp1 = { x: (start.x + nodeX) / 2, y: start.y };
                 const cp2 = { x: (start.x + nodeX) / 2, y: nodeY };

                 // Path: Cubic Bezier or just Line-Line-Line?
                 // PRD says "Radial/Tree structure".
                 // Let's do a smooth curve.
                 const pathD = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${nodeX} ${nodeY}`;

                 const isHovered = hoveredNode === node.id;
                 const isDimmed = hoveredNode && !isHovered;

                 return (
                   <g key={node.id}>
                     {/* Connection Line */}
                     <motion.path
                       d={pathD}
                       fill="none"
                       stroke={isHovered ? '#00D4FF' : '#635BFF'} // Cyan on hover, Blurple default
                       strokeWidth={isHovered ? 3 : 2}
                       strokeDasharray="6 6"
                       strokeOpacity={isDimmed ? 0.2 : 1}
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 0.5, delay: node.delay + 0.3 }} // Wait for expansion
                     />
                   </g>
                 );
              })}
            </svg>

            {/* 3. The Nodes (HTML Elements for interaction) */}
            {NODES.map((node) => {
               const nodeX = START_X + 50 + 60; 
               const nodeY = CENTER_Y + node.yOffset;
               
               return (
                 <motion.div
                   key={node.id}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: node.delay + 0.6, type: "spring" }}
                   className="absolute pointer-events-auto cursor-pointer group"
                   style={{
                     left: nodeX,
                     top: nodeY - 24, // Center vertically (height 48)
                   }}
                   onMouseEnter={() => setHoveredNode(node.id)}
                   onMouseLeave={() => setHoveredNode(null)}
                 >
                    <div className="flex items-center gap-3">
                       {/* Avatar Circle */}
                       <div className={`
                          w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center shadow-md relative z-10 transition-colors
                          ${hoveredNode === node.id ? 'border-[#00D4FF]' : 'border-slate-200'}
                       `}>
                          <node.icon className={`w-5 h-5 ${hoveredNode === node.id ? 'text-[#00D4FF]' : 'text-slate-500'}`} />
                          
                          {/* Status Dot */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                       </div>

                       {/* Label (Right of avatar) */}
                       <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">{node.label}</span>
                          <span className="text-xs text-slate-500">{node.sub}</span>
                       </div>
                    </div>

                    {/* Tooltip (Hover State) */}
                    <AnimatePresence>
                      {hoveredNode === node.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, x: 20 }}
                          animate={{ opacity: 1, y: 0, x: 20 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute left-full top-0 ml-4 w-64 bg-slate-900/95 text-white p-4 rounded-xl shadow-xl backdrop-blur-md z-50 pointer-events-none"
                        >
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-100">{node.label} Account</span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30">Verified</span>
                           </div>
                           <div className="space-y-2 text-xs text-slate-400">
                              <div className="flex justify-between">
                                 <span>Last Payout</span>
                                 <span className="text-white">Instant (Debit)</span>
                              </div>
                              <div className="flex justify-between border-t border-slate-700 pt-2">
                                 <span>Platform Fee</span>
                                 <span className="text-[#00D4FF]">15.0%</span>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </motion.div>
               );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
