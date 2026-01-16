import { motion, AnimatePresence } from 'framer-motion';
import paymentPhone from '@/assets/payment-phone.png';
import { STAGE } from '@/config/products';

interface PaymentSimulationProps {
  isActive: boolean;
}

export const PaymentSimulation = ({ isActive }: PaymentSimulationProps) => {
  // Dimensions
  const PHONE_WIDTH = 120; // 50% smaller (was 240)
  const PHONE_ASPECT = 1.6;
  const PHONE_HEIGHT = PHONE_WIDTH * PHONE_ASPECT;
  
  // Position - Left side of stage
  const POS_X = 140; // Shifted right to center in gap
  
  // Align vertically with Card Center (510px).
  // Phone Height is 192px. Half is 96px.
  // POS_Y = 510 - 96 = 414.
  const POS_Y = 414; 

  // Connection Line Points
  // Start: Center of phone (behind it)
  // This satisfies "appear from under the image" (z-index wise)
  // and allows for a perfectly straight centered line.
  const startX = POS_X + PHONE_WIDTH / 2;
  const centerY = POS_Y + (PHONE_HEIGHT / 2);

  // End: Left edge of central card, Vertically Centered
  // Card Center Y is approx 510.
  const cardLeftEdge = STAGE.cardCenterX - 300;
  
  // Straight horizontal line
  const finalPath = `
    M ${startX} ${centerY}
    L ${cardLeftEdge - 8} ${centerY}
  `;

  return (
    <AnimatePresence>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Connecting Line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <marker
                id="arrow-head"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="3"
                markerHeight="3"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            <motion.path
              d={finalPath}
              fill="none"
              stroke="#94a3b8" // slate-400
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd="url(#arrow-head)"
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={{ 
                opacity: 1,
                strokeDashoffset: [0, -24] // Explicit keyframes for loop
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.5 },
                strokeDashoffset: { 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 1.0 // Slower speed
                }
              }}
            />
          </svg>

          {/* Phone Image */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute shadow-2xl rounded-[1.5rem] overflow-hidden bg-white"
            style={{
              left: POS_X,
              top: POS_Y,
              width: PHONE_WIDTH,
            }}
          >

            <img 
              src={paymentPhone} 
              alt="Payment Demo" 
              className="w-full h-auto block"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
