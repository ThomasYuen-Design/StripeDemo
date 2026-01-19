import { useState, useEffect, useRef } from 'react';
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
  const [trend, setTrend] = useState("+4.2%");
  
  const prevActiveCount = useRef(0);
  
  const isActive = activeProducts.includes('payments');
  
  // Spike Effect when adding products
  useEffect(() => {
    if (isActive && activeProducts.length > prevActiveCount.current && prevActiveCount.current > 0) {
       // Spike between 5% and 20%
       const spikePercent = 0.05 + Math.random() * 0.15; 
       setRevenue(prev => prev * (1 + spikePercent));
       
       // Ensure new trend is at least higher than default (which is 4.2%, so 5% is fine)
       // We'll just display the spike growth as the new "current trend" or similar metric
       setTrend(`+${(spikePercent * 100).toFixed(1)}%`);
    }
    prevActiveCount.current = activeProducts.length;
  }, [activeProducts, isActive]);

  // Simulation Loop
  useEffect(() => {
    if (!isActive) {
      // Reset state when inactive
      setRevenue(0);
      setData([]);
      setIsWakingUp(false);
      setTrend("+4.2%");
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
        opacity: isActive ? 1 : 0.6,
        filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)',
        boxShadow: isActive 
            ? '0 20px 50px -12px rgba(30, 30, 30, 0.25)' 
            : 'none',
        backgroundColor: isActive ? '#FFFFFF' : 'transparent',
        borderColor: isActive ? 'rgb(226, 232, 240)' : 'rgba(148, 163, 184, 0.5)'
      }}
      transition={{ duration: 0.5 }}
      className="absolute z-20 w-[90%] md:w-[600px] rounded-3xl border overflow-hidden flex flex-col"
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
          <motion.div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
            animate={{
              backgroundColor: isActive ? '#0f172a' : 'transparent',
              color: isActive ? '#ffffff' : '#94a3b8',
              borderWidth: isActive ? 0 : 2,
              borderColor: isActive ? 'transparent' : '#94a3b8',
              WebkitTextStroke: isActive ? '0px' : '1px #94a3b8',
            }}
            style={{
              borderStyle: 'solid',
            }}
          >
            <span style={{ 
              WebkitTextStroke: isActive ? '0px transparent' : '1px #94a3b8',
              color: isActive ? '#ffffff' : 'transparent'
            }}>A</span>
          </motion.div>
          <div>
            <motion.h3 
              className="text-lg font-bold leading-tight"
              animate={{
                color: isActive ? '#1e293b' : '#94a3b8'
              }}
            >
              Acme Corp
            </motion.h3>
          </div>
        </div>
      </div>

      {/* Content Slots */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        {/* Metric Area */}
        <div className="mb-8">
           <AnimatePresence mode="wait">
             {isActive && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0 }}
               >
                 <MetricSlot 
                   label="NET VOLUME" 
                   value={formattedRevenue}
                   trend={trend}
                 />
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
