import { motion, AnimatePresence } from 'framer-motion';
import paymentPhone from '@/assets/payment-phone.png';
import terminalPos from '@/assets/images/terminal-POS.png';
import { STAGE } from '@/config/products';
import { ProductId } from '@/types';

interface DeviceSimulationLayerProps {
  activeProducts: ProductId[];
}

interface SimulationDeviceProps {
  id: string;
  image: string;
  x: number;
  y: number; // Center Y of the device
  width: number;
  targetY: number; // Where the line hits the card
  isVisible: boolean;
}

const SimulationDevice = ({ id, image, x, y, width, targetY, isVisible }: SimulationDeviceProps) => {
  const ASPECT_RATIO = 1.6;
  const height = width * ASPECT_RATIO;
  const top = y - (height / 2);
  
  // Line start (center of device)
  const startX = x + width / 2;
  const startY = y;
  
  // Card Edge
  const cardLeftEdge = STAGE.cardCenterX - 300;

  // Path Logic
  // We need a path that goes from (startX, startY) to (cardLeftEdge, targetY).
  // Uses keyframe animation for dash offset.
  
  // To make it look elegant:
  // 1. Horizontal out from device
  // 2. Curve if needed (if targetY != startY)
  // 3. Horizontal into card
  
  // If we are strictly horizontal (centering logic), simple line.
  // If we are stacked, we might need a curve? 
  // Reference image showed nice curved paths.
  // Let's use a cubic bezier for smooth S-curve if levels differ, or simple line if same.
  
  let path = '';
  if (Math.abs(targetY - startY) < 5) {
      // Simple horizontal line
      path = `M ${startX} ${startY} L ${cardLeftEdge - 8} ${startY}`;
  } else {
      // Orthogonal Path: 
      // 1. Horizontal from device
      // 2. Vertical segment
      // 3. Horizontal to card
      
      const midX = (startX + cardLeftEdge) / 2;
      const cornerRadius = 20;

      // Ensure we have enough space for corners
      const safeCornerRadius = Math.min(cornerRadius, Math.abs(midX - startX) / 2);

      // We need to draw a path that looks like:
      // Start -> [Line] -> [Corner] -> [Vertical Line] -> [Corner] -> [Line] -> End

      // Determine direction of vertical drop
      const verticalDir = targetY > startY ? 1 : -1;
      
      path = `
        M ${startX} ${startY}
        L ${midX - safeCornerRadius} ${startY}
        Q ${midX} ${startY} ${midX} ${startY + (safeCornerRadius * verticalDir)}
        L ${midX} ${targetY - (safeCornerRadius * verticalDir)}
        Q ${midX} ${targetY} ${midX + safeCornerRadius} ${targetY}
        L ${cardLeftEdge - 8} ${targetY}
      `;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Connecting Line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
             <defs>
              <marker
                id={`arrow-head-${id}`}
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
              d={path}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="6 6"
              markerEnd={`url(#arrow-head-${id})`}
              initial={{ opacity: 0, strokeDashoffset: 0 }}
              animate={{ 
                opacity: 1,
                strokeDashoffset: [0, -24] 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 0.5 },
                strokeDashoffset: { 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 1.0 
                }
              }}
            />
          </svg>

          {/* Device Image */}
          <motion.div
            layout // Enable layout animation for smooth position changes
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute z-10"
            style={{
              left: x,
              top: top, // Passed directly to style
              width: width,
              height: height,
            }}
          >
            <img 
              src={image} 
              alt={id} 
              className="w-full h-auto block"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DeviceSimulationLayer = ({ activeProducts }: DeviceSimulationLayerProps) => {
  const showPhone = activeProducts.includes('payments');
  const showTerminal = activeProducts.includes('terminal');

  // Config
  const POS_X = 140;
  const CENTER_Y = 510; // Corrected: Card Top (320) + Half Min-Height (190) = 510
  const STACK_OFFSET = 150; // Increased spacing (was 120)
  
  // Phone Props
  const phoneY = (showPhone && showTerminal) ? CENTER_Y - STACK_OFFSET : CENTER_Y;
  
  // Reference image showed lines converging to specific input fields or just general area.
  // Let's keep lines fairly straight or gentle curves.
  // If stacked, let's target positions on the card that "look good".
  // Card Center is 510. 
  // If Phone is high (304), line going to 510 is a steep drop.
  // Maybe target slightly offset points on the card too?
  // User ref image: The lines go to inputs.
  // Let's target: 
  // Phone -> Top part of card logic (e.g. 460)
  // Terminal -> Bottom part of card (e.g. 560)
  
  const stackedPhoneTargetY = CENTER_Y - 50; 
  const stackedTerminalTargetY = CENTER_Y + 50;

  return (
    <div className="absolute inset-0 pointer-events-none">
       {/* Phone */}
       <SimulationDevice 
         id="phone"
         image={paymentPhone}
         x={POS_X}
         y={phoneY}
         targetY={(showPhone && showTerminal) ? stackedPhoneTargetY : CENTER_Y}
         width={120}
         isVisible={showPhone}
       />
       
       {/* Terminal */}
       <SimulationDevice 
         id="terminal"
         image={terminalPos}
         x={POS_X}
         y={(showPhone && showTerminal) ? CENTER_Y + STACK_OFFSET : CENTER_Y}
         targetY={(showPhone && showTerminal) ? stackedTerminalTargetY : CENTER_Y}
         width={120}
         isVisible={showTerminal}
       />
    </div>
  );
};
