import { motion, AnimatePresence } from 'framer-motion';
import paymentPhone from '@/assets/payment-phone.png';
import terminalPos from '@/assets/images/terminal-POS.png';
import fraudIcon from '@/assets/Fraud-detection.svg';
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

  let path = '';
  if (Math.abs(targetY - startY) < 5) {
      // Simple horizontal line
      path = `M ${startX} ${startY} L ${cardLeftEdge - 8} ${startY}`;
  } else {
      // Orthogonal Path: 
      const midX = (startX + cardLeftEdge) / 2;
      const cornerRadius = 20;
      const safeCornerRadius = Math.min(cornerRadius, Math.abs(midX - startX) / 2);
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
  const showRadar = activeProducts.includes('radar');

  // Config
  const POS_X = 140;
  const CENTER_Y = 510;
  const STACK_OFFSET = 150; 
  
  // Dimensions
  const DEVICE_WIDTH = 120;
  const DEVICE_HEIGHT = DEVICE_WIDTH * 1.6; // 192

  // Logic
  const isStacked = showPhone && showTerminal;
  const phoneY = isStacked ? CENTER_Y - STACK_OFFSET : CENTER_Y;
  const terminalY = isStacked ? CENTER_Y + STACK_OFFSET : CENTER_Y;
  
  const stackedPhoneTargetY = CENTER_Y - 50; 
  const stackedTerminalTargetY = CENTER_Y + 50;
  
  // Calculate Frame Bounds
  const PADDING = 20;
  const HEADER_HEIGHT = 40;
  
  // Determine top and bottom Y of active content
  let contentTopY = CENTER_Y;
  let contentBottomY = CENTER_Y;

  if (isStacked) {
      contentTopY = phoneY - (DEVICE_HEIGHT / 2); // Top of phone
      contentBottomY = terminalY + (DEVICE_HEIGHT / 2); // Bottom of terminal
  } else if (showPhone || showTerminal) {
      // Single device centered
      contentTopY = CENTER_Y - (DEVICE_HEIGHT / 2);
      contentBottomY = CENTER_Y + (DEVICE_HEIGHT / 2);
  }

  const frameTop = contentTopY - PADDING - HEADER_HEIGHT;
  const frameHeight = (contentBottomY - contentTopY) + (PADDING * 2) + HEADER_HEIGHT;
  const frameLeft = POS_X - PADDING;
  const frameWidth = DEVICE_WIDTH + (PADDING * 2);

  return (
    <div className="absolute inset-0 pointer-events-none">
       {/* Radar Fraud Frame */}
       <AnimatePresence>
         {showRadar && (showPhone || showTerminal) && (
           <motion.div
             layout
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.4 }}
             className="absolute border-2 border-dashed border-[#FF5996] rounded-2xl bg-[#FF5996]/5 z-0"
             style={{
               left: frameLeft,
               top: frameTop,
               width: frameWidth,
               height: frameHeight,
             }}
           >
              {/* Header */}
              <div className="flex items-center gap-2 p-2 absolute top-0 left-0 w-full">
                 <img src={fraudIcon} alt="Fraud Detection" className="w-5 h-5" />
                 <span className="text-[#FF5996] font-medium text-xs whitespace-nowrap">
                   Fraud detection
                 </span>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Phone */}
       <SimulationDevice 
         id="phone"
         image={paymentPhone}
         x={POS_X}
         y={phoneY}
         targetY={(showPhone && showTerminal) ? stackedPhoneTargetY : CENTER_Y}
         width={DEVICE_WIDTH}
         isVisible={showPhone}
       />
       
       {/* Terminal */}
       <SimulationDevice 
         id="terminal"
         image={terminalPos}
         x={POS_X}
         y={terminalY}
         targetY={(showPhone && showTerminal) ? stackedTerminalTargetY : CENTER_Y}
         width={DEVICE_WIDTH}
         isVisible={showTerminal}
       />
    </div>
  );
};
