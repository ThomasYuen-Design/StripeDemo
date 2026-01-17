import { motion } from 'framer-motion';
import { STAGE } from '@/config/products';

interface MoneyFlowAnimationProps {
  isActive: boolean;
  activeProducts: string[];
}

export const MoneyFlowAnimation = ({ isActive, activeProducts }: MoneyFlowAnimationProps) => {
  if (!isActive) return null;

  // Global Payouts check
  const hasGlobalPayouts = activeProducts.includes('globalPayouts');
  
  // Coordinates
  // const INPUT_X = STAGE.cardCenterX - 400; // Unused
  const CARD_LEFT = 400; 
  const CARD_RIGHT = 1000;
  const CENTER_Y = 510;

  const payoutColor = hasGlobalPayouts ? '#10B981' : '#00D4FF'; // Emerald if Global Payouts, else Cyan

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg className="absolute inset-0 w-full h-full overflow-visible">
         <defs>
           <linearGradient id="orb-trail" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#fff" stopOpacity="0" />
             <stop offset="100%" stopColor="#fff" stopOpacity="0.8" />
           </linearGradient>
         </defs>
      </svg>
      
      {/* 1. Main Money Orb Check (Input -> Business) */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        initial={{ x: CARD_LEFT - 100, y: CENTER_Y - 8, opacity: 0 }}
        animate={{ 
          x: [CARD_LEFT - 100, STAGE.cardCenterX], 
          opacity: [0, 1, 1] 
        }}
        transition={{
          duration: 1,
          ease: "easeIn",
          repeat: Infinity,
          repeatDelay: 1.5 
        }}
      />
      
      {/* 2. Fracture (At Center) */}
      {/* Small fragment (Fee) loops back */}
      <motion.div
         className="absolute w-2 h-2 rounded-full bg-yellow-400 shadow-md"
         initial={{ x: STAGE.cardCenterX, y: CENTER_Y - 4, opacity: 0 }}
         animate={{ 
           x: [STAGE.cardCenterX, STAGE.cardCenterX - 50, STAGE.cardCenterX],
           y: [CENTER_Y - 4, CENTER_Y - 40, CENTER_Y - 4],
           opacity: [0, 1, 0]
         }}
         transition={{
           duration: 1,
           ease: "circOut",
           delay: 1, // Start after main orb arrives
           repeat: Infinity,
           repeatDelay: 1.5
         }}
      />

      {/* 3. Payout Orb (Center -> Connect) */}
      <motion.div
        className="absolute w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]"
        style={{
            backgroundColor: payoutColor,
            boxShadow: `0 0 8px ${payoutColor}`
        }}
        initial={{ x: STAGE.cardCenterX, y: CENTER_Y - 6, opacity: 0 }}
        animate={{ 
           x: [STAGE.cardCenterX, CARD_RIGHT + 50],
           opacity: [1, 1, 0]
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 1,
          repeat: Infinity,
          repeatDelay: 1.7
        }}
      />
    </div>
  );
};
