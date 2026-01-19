import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricSlot } from './slots/MetricSlot';
import { GraphVisualizer } from './slots/GraphVisualizer';
import { STAGE } from '@/config/products';
import type { ProductId } from '@/types';

interface CentralCardProps {
  activeProducts: ProductId[];
}

const POINT_COUNT = 40;
const INITIAL_REVENUE = 39274.29;

export const CentralCard = ({ activeProducts }: CentralCardProps) => {
  const [revenue, setRevenue] = useState(0);
  const [data, setData] = useState<number[]>([]);
  const [isWakingUp, setIsWakingUp] = useState(false);
  
  const isActive = activeProducts.includes('payments');
  
  // Simulation Loop
  useEffect(() => {
    if (!isActive) {
      // Reset state when inactive
      setRevenue(0);
      setData([]);
      setIsWakingUp(false);
      return;
    }

    // "Wake Up" Sequence
    setIsWakingUp(true);
    let currentRevenue = 0;
    const targetRevenue = INITIAL_REVENUE;
    
    // Animate revenue count up quickly
    const countUpDuration = 800;
    const startTime = Date.now();
    
    const animationFrame = requestAnimationFrame(function animate() {
      const now = Date.now();
      const progress = Math.min((now - startTime) / countUpDuration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setRevenue(targetRevenue * ease);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsWakingUp(false);
      }
    });

    // Initialize Graph Data (Flat with slight noise)
    const initialData = Array.from({ length: POINT_COUNT }, () => 100 + (Math.random() * 10));
    setData(initialData);

    // Ghost Loop & Micro-Spikes
    const interval = setInterval(() => {
      setData(prev => {
        // Shift left
        const next = prev.slice(1);
        
        // Generate new point
        // 90% chance of small variation, 10% chance of "Micro-Spike"
        const isSpike = Math.random() > 0.9;
        
        let newVal = prev[prev.length - 1]; // Continuation
        
        if (isSpike) {
           newVal += (Math.random() * 10 + 2); // Smaller jump
           // Increment Revenue on Spike
           setRevenue(r => r + (Math.random() > 0.5 ? 45.00 : 120.00));
        } else {
           // Very gentle drift
           newVal += (Math.random() - 0.45) * 1; 
        }
        
        return [...next, newVal];
      });
    }, 200);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [isActive]);

  const formattedRevenue = `CA$${revenue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0.5, filter: 'grayscale(100%)' }}
      animate={{ 
        opacity: isActive ? 1 : 0.8,
        filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
        boxShadow: isActive 
            ? '0 20px 50px -12px rgba(99, 91, 255, 0.25)' 
            : '0 10px 30px -10px rgba(0,0,0,0.1)',
        backgroundColor: isActive ? '#FFFFFF' : '#F8FAFC' 
      }}
      transition={{ duration: 0.5 }}
      className="absolute z-20 w-[90%] md:w-[600px] rounded-3xl border border-slate-200 overflow-hidden flex flex-col"
      style={{
        left: `${(STAGE.cardCenterX / STAGE.width) * 100}%`,
        top: `${(STAGE.cardTopY / STAGE.height) * 100}%`,
        minHeight: '380px',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Header / Brand */}
      <div className="px-8 pt-8 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              Acme Corp
            </h3>
          </div>
        </div>
      </div>

      {/* Content Slots */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        {/* Metric Area */}
        <div className="mb-8">
           <AnimatePresence mode="wait">
             {isActive ? (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
               >
                 <MetricSlot 
                   label="NET VOLUME" 
                   value={formattedRevenue}
                   trend="+32.8%"
                 />
               </motion.div>
             ) : (
                <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-20 flex items-center text-slate-300 font-medium italic"
                >
                   Activate Payments to view data
                </motion.div>
             )}
           </AnimatePresence>
        </div>
        
        {/* Graph Area - Bottom 40% */}
        <div className="h-40 -mx-8 -mb-8 relative">
           {isActive && (
              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1 }} // Fade in graph
                 className="w-full h-full"
              >
                 <GraphVisualizer data={data} height={160} width={600} />
              </motion.div>
           )}
        </div>
      </div>
    </motion.div>
  );
};
