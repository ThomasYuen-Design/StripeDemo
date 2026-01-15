import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { ProductId } from '@/types';

interface GraphVisualizerProps {
  activeProducts: ProductId[];
}

export const GraphVisualizer = ({ activeProducts }: GraphVisualizerProps) => {
  const isConnect = activeProducts.includes('connect');
  const isBilling = activeProducts.includes('billing');
  const isRadar = activeProducts.includes('radar');

  // SVG Paths for different graph types
  const linePath =
    'M 0 100 C 40 80, 80 80, 120 40 C 160 10, 200 30, 240 10 C 280 -10, 320 20, 360 5';
  const splitPathGross =
    'M 0 100 C 60 90, 120 50, 180 30 C 240 10, 300 5, 360 0';
  const splitPathNet =
    'M 0 100 C 60 95, 120 80, 180 70 C 240 60, 300 55, 360 50';
  const stepPath =
    'M 0 100 L 60 100 L 60 80 L 120 80 L 120 60 L 180 60 L 180 40 L 240 40 L 240 20 L 300 20 L 300 10 L 360 10';

  return (
    <div className="relative h-48 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-end">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border-t border-slate-200/50 w-full"
            style={{ height: '25%' }}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 360 110"
        className="w-full h-full overflow-visible p-4 pb-0"
      >
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#635BFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#635BFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0048E5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0048E5" stopOpacity="0" />
          </linearGradient>
        </defs>

        <AnimatePresence mode="wait">
          {/* Case 1: Connect (Split Graph) */}
          {isConnect ? (
            <motion.g key="split">
              <motion.path
                d={splitPathGross}
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d={splitPathNet}
                fill="url(#blueGradient)"
                stroke="#0048E5"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
              />
            </motion.g>
          ) : isBilling ? (
            /* Case 2: Billing (Step Graph) */
            <motion.g key="step">
              <motion.path
                d={stepPath}
                fill="url(#purpleGradient)"
                stroke="#00D4FF"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, type: 'spring' }}
              />
            </motion.g>
          ) : (
            /* Base Case: Simple Line */
            <motion.g key="line">
              <motion.path
                d={linePath}
                fill="url(#purpleGradient)"
                stroke="#635BFF"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Radar Overlay */}
      <AnimatePresence>
        {isRadar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute top-0 bottom-0 w-[2px] bg-red-500/50 shadow-[0_0_15px_rgba(255,66,77,0.5)] z-10"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute top-2 right-2 flex gap-1 items-center bg-red-50 border border-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold">
              <ShieldCheck size={10} />
              SCANNING
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
