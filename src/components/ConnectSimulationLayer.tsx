
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Car, User } from 'lucide-react';
import { STAGE } from '@/config/products';
import ConnectIcon from '@/assets/svgexport-100.svg';

interface ConnectSimulationLayerProps {
  isActive: boolean;
}

export const ConnectSimulationLayer = ({ isActive }: ConnectSimulationLayerProps) => {


  // Position: To the right of the central card
  // Card ends at center(700) + 300 = 1000.
  // Connect Box starts at 1050?
  const START_X = STAGE.cardCenterX + 300; 
  const CENTER_Y = 510;
  
  // Nodes Config
  const NODES = [
    { id: 'store', icon: Store, label: 'Merchant A', sub: 'Marketplace Seller', yOffset: -80, delay: 0 },
    { id: 'driver', icon: Car, label: 'Driver', sub: 'Gig Worker', yOffset: 0, delay: 0.1 },
    { id: 'creator', icon: User, label: 'Creator', sub: 'Freelancer', yOffset: 80, delay: 0.2 },
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
               animate={{ width: 320, opacity: 1 }}
               exit={{ width: 0, opacity: 0 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="absolute border-2 border-dashed rounded-3xl bg-slate-50/50 input-events-auto"
               style={{
                 left: START_X + 50, // Gap from card
                 top: CENTER_Y - 140,
                 height: 280,
                 borderColor: 'rgba(99, 91, 255, 0.3)', // Light blurple
               }}
            >
               <div 
                 className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] border px-2 py-1 rounded-full"
                 style={{ borderColor: 'rgba(99, 91, 255, 0.3)' }}
               >
                 <img src={ConnectIcon} alt="" className="w-4 h-4" />
                 Connect
               </div>
            </motion.div>

            {/* 2. The Sprouting Lines & Nodes */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {NODES.map((node) => {
                 const start = { x: START_X, y: CENTER_Y };
                 const nodeX = START_X + 50 + 64; 
                 const nodeY = CENTER_Y + node.yOffset;
                 
                 // Orthogonal Path Generation (Horizontal -> Vertical -> Horizontal)
                 // Shift branching point (midX) closer to nodes to avoid overlap with dashed box
                 const midX = nodeX - 24; // Branch 24px before the icon (aligned with Global Payouts)
                 const cornerRadius = 20;
                 
                 // Check if straight line
                 const isStraight = Math.abs(start.y - nodeY) < 1;
                 
                 let pathD = '';
                 
                 if (isStraight) {
                    pathD = `M ${start.x} ${start.y} L ${nodeX} ${nodeY}`;
                 } else {
                    const direction = nodeY > start.y ? 1 : -1;
                    const safeRadius = Math.min(cornerRadius, Math.abs(midX - start.x) / 2);
                    
                    // M start -> L mid-r, startY -> Q mid, startY mid, startY+r -> L mid, endY-r -> Q mid, endY mid+r, endY -> L end
                    pathD = `
                      M ${start.x} ${start.y}
                      L ${midX - safeRadius} ${start.y}
                      Q ${midX} ${start.y} ${midX} ${start.y + (safeRadius * direction)}
                      L ${midX} ${nodeY - (safeRadius * direction)}
                      Q ${midX} ${nodeY} ${midX + safeRadius} ${nodeY}
                      L ${nodeX} ${nodeY}
                    `;
                 }

                 return (
                   <g key={node.id}>
                     {/* Base Path (Rail) */}
                     <motion.path
                       d={pathD}
                       fill="none"
                       stroke="#cbd5e1" // Slate 300
                       strokeWidth="2"
                       strokeOpacity={0.4}
                       initial={{ pathLength: 0, opacity: 0 }}
                       animate={{ pathLength: 1, opacity: 0.4 }}
                       transition={{ duration: 0.5, delay: node.delay + 0.3 }}
                     />
                     
                     {/* Data Flow Particle */}
                     <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#0073E6"
                        strokeWidth="2"
                        strokeDasharray="4 120"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 0, opacity: 0 }}
                        animate={{ 
                            strokeDashoffset: -124, 
                            opacity: 1 
                        }}
                        transition={{
                          strokeDashoffset: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                          },
                          opacity: { duration: 0.3, delay: node.delay + 0.5 }
                        }}
                     />
                   </g>
                 );
              })}
            </svg>

            {/* 3. The Nodes (HTML Elements for interaction) */}
            {NODES.map((node) => {
               const nodeX = START_X + 50 + 64; 
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
                 >
                    <div className="flex items-center gap-3">
                       {/* Avatar Circle */}
                       <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center shadow-sm relative z-10 transition-colors">
                          <node.icon className="w-5 h-5 text-slate-500" />
                          
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
                 </motion.div>
               );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
