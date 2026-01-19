import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Landmark } from 'lucide-react';


interface TaxSimulationLayerProps {
  isActive: boolean;
}

export const TaxSimulationLayer = ({ isActive }: TaxSimulationLayerProps) => {
  // Config
  const SIPHON_X = 360; // Configured to tap into the main line
  const MAIN_LINE_Y = 416; // Center Y where the main line runs
  const TAX_NODE_Y = 800; // Where the tax engine sits
  const REMITTANCE_Y = 880; // Official Entity below

  // Animation Variants
  const particleTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "linear",
    repeatDelay: 0.5
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
            {/* 1. The Siphon Line (Purple Dotted) */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              <defs>
                 <marker
                    id="tax-arrow"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="3"
                    markerHeight="3"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#635BFF" />
                  </marker>
              </defs>

              {/* Vertical Drop Line */}
              <motion.line
                x1={SIPHON_X}
                y1={MAIN_LINE_Y}
                x2={SIPHON_X}
                y2={TAX_NODE_Y - 25} // Stop at top of node
                stroke="#635BFF"
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                markerEnd="url(#tax-arrow)"
              />

              {/* Extraction Animation: Particle dropping */}
              <motion.circle
                r={4}
                fill="#635BFF"
                initial={{ cx: SIPHON_X, cy: MAIN_LINE_Y, opacity: 0 }}
                animate={{ 
                    cy: [MAIN_LINE_Y, TAX_NODE_Y - 25],
                    opacity: [0, 1, 0]
                }}
                transition={particleTransition}
              />
              
              {/* Connector to Remittance */}
              <motion.line
                x1={SIPHON_X}
                y1={TAX_NODE_Y + 25}
                x2={SIPHON_X}
                y2={REMITTANCE_Y - 20}
                stroke="#CBD5E1" // Slate 300
                strokeWidth={1}
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />
            </svg>

            {/* 2. Nodes */}
            
            {/* Node A: Tax Engine (Automation) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute flex items-center justify-center bg-white border-2 border-[#635BFF] rounded-full shadow-lg z-20"
              style={{
                left: SIPHON_X - 25, // Center it (width 50)
                top: TAX_NODE_Y - 25,
                width: 50,
                height: 50,
              }}
            >
              <PieChart className="w-6 h-6 text-[#635BFF]" />
              {/* Auto-Pilot Badge */}
              <div className="absolute -top-1 -right-1 bg-[#635BFF] text-white rounded-full p-1 border-2 border-white">
                 <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                 </svg>
              </div>
            </motion.div>
            
            {/* Label for Tax Engine */}
            <motion.div
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="absolute text-right"
               style={{
                   left: SIPHON_X - 100,
                   top: TAX_NODE_Y - 10,
                   width: 60,
               }}
            >
                <div className="text-[10px] font-bold text-[#635BFF] uppercase tracking-wide">Stripe Tax</div>
            </motion.div>

            {/* Node B: Remittance (Government) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute flex items-center justify-center bg-slate-50 border border-slate-300 rounded-lg shadow-sm z-20"
              style={{
                left: SIPHON_X - 20, // Center (width 40)
                top: REMITTANCE_Y - 20,
                width: 40,
                height: 40,
              }}
            >
              <Landmark className="w-5 h-5 text-slate-500" />
            </motion.div>
             
            {/* Label for Remittance */}
            <motion.div
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
               className="absolute whitespace-nowrap"
               style={{
                   left: SIPHON_X + 30, // Right side
                   top: REMITTANCE_Y - 8,
               }}
            >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Remittance</div>
                <div className="text-[8px] text-slate-400">Govt. Tax Authority</div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
