import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import paymentPhone from '@/assets/payment-phone.png';
import terminalPos from '@/assets/images/terminal-POS.png';
import fraudIcon from '@/assets/Fraud-detection.svg';
import authBoostIcon from '@/assets/images/Credit-Safe.svg';
import billingIcon from '@/assets/svgexport-128.svg';
import { STAGE } from '@/config/products';
import { ProductId } from '@/types';

// Animation Constants
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
  isBoosted?: boolean;
  hasBilling?: boolean;
  hasRadar?: boolean;
}

const SimulationDevice = ({ id, image, x, y, width, targetY, isVisible, isBoosted, hasBilling, hasRadar }: SimulationDeviceProps) => {
  const [internalVisible, setInternalVisible] = useState(isVisible);
  const [isLineReady, setIsLineReady] = useState(false);
  
  // Local state to "freeze" position during exit
  const [pos, setPos] = useState({ y, targetY });


  useEffect(() => {
    if (isVisible) {
      setInternalVisible(true);
      setPos({ y, targetY });
    } else {
      // Step 1: Hide line first
      setIsLineReady(false);
      // Step 2: After line fades, hide device (500ms matches line transition)
      const timer = setTimeout(() => {
        setInternalVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, y, targetY]);

  // Radar Animation Randomness Generator
  const [radarCycle, setRadarCycle] = useState(0);
  const radarParams = useMemo(() => {
    // Random Start Delay (0.5s to 3s) for "More Random Appearance"
    const delay = Math.random() * 2.5 + 0.5;
    // Random Stop Distance (80px to 180px)
    const stopDist = -(Math.random() * 100 + 80);
    return { delay, stopDist };
  }, [radarCycle]);
  
  
  const ASPECT_RATIO = 1.6;
  const height = width * ASPECT_RATIO;
  const top = pos.y - (height / 2);
  
  // Line start (center of device)
  const startX = x + width / 2;
  const startY = pos.y;
  
  // Card Edge
  const cardLeftEdge = STAGE.cardCenterX - 300;

  // Render Logic for Path
  let path = '';
  if (Math.abs(pos.targetY - startY) < 5) {
      path = `M ${startX} ${startY} L ${cardLeftEdge - 8} ${startY}`;
  } else {
      const midX = startX + (cardLeftEdge - startX) * 0.75;
      const cornerRadius = 20;
      const safeCornerRadius = Math.min(cornerRadius, Math.abs(midX - startX) / 2);
      const verticalDir = pos.targetY > startY ? 1 : -1;
      
      path = `
        M ${startX} ${startY}
        L ${midX - safeCornerRadius} ${startY}
        Q ${midX} ${startY} ${midX} ${startY + (safeCornerRadius * verticalDir)}
        L ${midX} ${pos.targetY - (safeCornerRadius * verticalDir)}
        Q ${midX} ${pos.targetY} ${midX + safeCornerRadius} ${pos.targetY}
        L ${cardLeftEdge - 8} ${pos.targetY}
      `;
  }
  
  // Determine stroke color/url
  const particleDash = "4 150";

  return (
    <AnimatePresence>
      {internalVisible && (
        <>
          {/* Connecting Line - Only show when device is ready */}
          {isLineReady && (
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
              {/* Base Line - Normal (Grey Dashed) - Always rendered */}
              <motion.path
                d={path}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeLinecap="round"
                markerEnd="url(#global-arrow-normal)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isBoosted ? 0 : 0.5 }}
                transition={{ 
                  pathLength: { duration: 0.5 },
                  opacity: { duration: 0.3 }
                }}
              />
              
              {/* Base Line - Boosted (Gradient Solid) - Always rendered */}
              <motion.path
                d={path}
                fill="none"
                stroke="url(#global-boost-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd="url(#global-arrow-boosted)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isBoosted ? 0.9 : 0 }}
                transition={{ 
                  pathLength: { duration: 0.5 },
                  opacity: { duration: 0.3 }
                }}
              />

              {/* Data Flow Particle (White/Bright Dash) */}
              <motion.path
                key={`${id}-particle-${isBoosted}`}
                d={path}
                fill="none"
                stroke={isBoosted ? "#fff" : "#635BFF"}
                strokeWidth="2"
                strokeDasharray={particleDash}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: -154, opacity: 1 }}
                transition={{
                  strokeDashoffset: {
                    duration: isBoosted ? 0.8 : 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  opacity: { duration: 0.3 }
                }}
                style={{ filter: 'drop-shadow(0 0 2px rgba(99,91,255,0.5))' }}
              />

              {/* Billing Particles (Occasional Yellow) */}
              {hasBilling && (
                <motion.path
                  key={`${id}-particle-billing`}
                  d={path}
                  fill="none"
                  stroke="#F3C623"
                  strokeWidth="2"
                  strokeDasharray="4 350" // Sparse yellow dots
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{ strokeDashoffset: -354, opacity: 1 }}
                  transition={{
                    strokeDashoffset: {
                      duration: 2.5, // Different speed or just synced? Let's sync speed somewhat but with different period
                      repeat: Infinity,
                      ease: "linear"
                    },
                    opacity: { duration: 0.3 }
                  }}
                  style={{ filter: 'drop-shadow(0 0 2px rgba(243, 198, 35, 0.5))' }}
                />
              )}

              {/* Radar Particles (Red - Move, Stop, Flash, Disappear) */}
              {hasRadar && (
                <motion.path
                  key={`${id}-particle-radar-${radarCycle}`} // Re-mounts on cycle change for new randoms
                  d={path}
                  fill="none"
                  stroke="#FF5996" 
                  strokeWidth="3"
                  strokeDasharray="4 1000" // Ensure single dot
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 0, opacity: 0 }}
                  animate={{ 
                    strokeDashoffset: [0, radarParams.stopDist, radarParams.stopDist, radarParams.stopDist], 
                    opacity: [0, 1, 1, 0.3, 1, 0] // Fade In -> Hold -> Flash (Dim->Bright) -> Out
                  }}
                  transition={{
                    strokeDashoffset: {
                        duration: 2, 
                        times: [0, 0.4, 0.7, 1],
                        ease: "easeInOut"
                    },
                    opacity: {
                        duration: 2,
                        times: [0, 0.1, 0.7, 0.8, 0.9, 1], // Sync with stop
                        ease: "linear"
                    },
                    delay: radarParams.delay, // Random start delay
                  }}
                  onAnimationComplete={() => setRadarCycle(c => c + 1)}
                />
              )}
            </svg>
          )}



          {/* Device Image Container */}
          <motion.div
            layout
            // Entrance Animation (Spring Physics)
            initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                mass: 1 
            }}
            onAnimationComplete={() => {
              if (isVisible) setIsLineReady(true);
            }}
            className="absolute z-10 perspective-1000" // perspective for 3d rotation
            style={{
              left: x,
              top: top,
              width: width,
              height: height,
            }}
          >
             <div className="w-full h-full relative">
                <img 
                  src={image} 
                  alt={id} 
                  className="w-full h-full object-contain block drop-shadow-2xl"
                />
             </div>
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
  const showAuthBoost = activeProducts.includes('authorizationBoost');
  const showBilling = activeProducts.includes('billing');

  // Config
  const POS_X = 140;
  const CENTER_Y = 510;
  const STACK_OFFSET = 150; 
  
  // Dimensions
  const DEVICE_WIDTH = 120;
  const DEVICE_HEIGHT = DEVICE_WIDTH * 1.6; // 192

  // Logic
  // Logic
  const isStacked = showPhone && showTerminal;
  const [effectivelyStacked, setEffectivelyStacked] = useState(isStacked);

  useEffect(() => {
    if (isStacked) {
      setEffectivelyStacked(true);
    } else {
      const timer = setTimeout(() => {
        setEffectivelyStacked(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isStacked]);

  const phoneY = effectivelyStacked ? CENTER_Y - STACK_OFFSET : CENTER_Y;
  const terminalY = effectivelyStacked ? CENTER_Y + STACK_OFFSET : CENTER_Y;
  
  const stackedPhoneTargetY = CENTER_Y - 50; 
  const stackedTerminalTargetY = CENTER_Y + 50;
  
  const phoneTargetY = (showPhone && effectivelyStacked) ? stackedPhoneTargetY : CENTER_Y;
  const terminalTargetY = (showTerminal && effectivelyStacked) ? stackedTerminalTargetY : CENTER_Y;
  
  // Calculate Frame Bounds
  const PADDING = 20;
  const HEADER_HEIGHT = 40;
  
  let contentTopY = CENTER_Y;
  let contentBottomY = CENTER_Y;

  if (effectivelyStacked) {
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

  // Billing Wrapper Calculations
  const BILLING_PADDING = 20; // 20px padding around Radar/Device frame
  const wrapperTop = frameTop - BILLING_PADDING;
  const wrapperLeft = frameLeft - BILLING_PADDING;
  const wrapperWidth = frameWidth + (BILLING_PADDING * 2);
  const wrapperHeight = frameHeight + (BILLING_PADDING * 2);

  return (
    <div className="absolute inset-0 pointer-events-none">
        {/* Shared Defs */}
       <svg className="absolute w-0 h-0">
          <defs>
             <linearGradient id="global-boost-gradient" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="400" y2="0">
                <stop offset="0%" stopColor="#11EFE3" />
                <stop offset="100%" stopColor="#9966FF" />
             </linearGradient>
             <marker
               id="global-arrow-normal"
               viewBox="0 0 10 10"
               refX="5"
               refY="5"
               markerWidth="3"
               markerHeight="3"
               orient="auto-start-reverse"
             >
               <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
             </marker>
             <marker
               id="global-arrow-boosted"
               viewBox="0 0 10 10"
               refX="5"
               refY="5"
               markerWidth="3"
               markerHeight="3"
               orient="auto-start-reverse"
             >
               <path d="M 0 0 L 10 5 L 0 10 z" fill="#9966FF" />
             </marker>
             <linearGradient id="fraud-particle-gradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF4842" />
                <stop offset="75%" stopColor="#FF4842" />
                <stop offset="100%" stopColor="transparent" />
             </linearGradient>
          </defs>
       </svg>

       {/* Billing Wrapper Frame (Outer) */}
       <AnimatePresence>
         {showBilling && (showPhone || showTerminal) && (
           <motion.div
             layout
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.4 }}
             className="absolute z-0"
             style={{
               left: wrapperLeft,
               top: wrapperTop,
               width: wrapperWidth,
               height: wrapperHeight,
             }}
           >
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                 <motion.rect
                    width="100%"
                    height="100%"
                    rx="16"
                    fill="rgba(243, 198, 35, 0.02)"
                    stroke="#f3c62379"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="20 10"
                    animate={{ strokeDashoffset: [0, -30] }}
                    transition={{
                       duration: 0.5,
                       ease: "linear",
                       repeat: Infinity
                    }}
                 />
              </svg>
              {/* Billing Header */}
              <div className="absolute -top-10 left-0 flex items-center gap-2">
                 <img src={billingIcon} alt="Billing" className="w-4 h-4" />
                 <span className="text-[#F3C623] font-semibold text-xs tracking-wide">Recurring billing</span>
              </div>
           </motion.div>
         )}
       </AnimatePresence>
       
       {/* Auth Boost Icon Overlay */}
       {/* Position: Midpoint between X=140+120(260) and Card=400? 
           Reference Image: Icon is 'over the dashed line'. 
           Midpoint logic: 
           Device Right Edge = 140 + 120 = 260.
           Card Left Edge = 400.
           Midpoint = 330.
           Y = CENTER_Y.
       */}
       <AnimatePresence>
         {showAuthBoost && (showPhone || showTerminal) && (
               <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute z-30 w-12 h-12 flex items-center justify-center backdrop-blur-md rounded-xl"
                  style={{
                     left: 350, // Matches the new midX shift point
                     top: CENTER_Y - 24, // Centered
                  }}
               >
                  <img src={authBoostIcon} alt="Authorization Boost" className="w-full h-full" />
               </motion.div>
         )}
       </AnimatePresence>

       {/* Radar Fraud Frame - Tech Scanner */}
       <AnimatePresence>
         {showRadar && (showPhone || showTerminal) && (
           <motion.div
             layout
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.4 }}
             className="absolute rounded-xl z-0 overflow-hidden"
             style={{
               left: frameLeft,
               top: frameTop,
               width: frameWidth,
               height: frameHeight,
               backgroundColor: 'rgba(255, 89, 150, 0.03)',
               border: '1px solid rgba(255, 89, 150, 0.2)'
             }}
           >

              {/* Header */}
              <div className="flex items-center gap-2 p-2 absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF5996]/10 to-transparent">
                 <img 
                    src={fraudIcon} 
                    alt="Fraud Detection" 
                    className="w-4 h-4 relative z-10" 
                 />
                 <span className="text-[#FF5996] font-semibold text-xs tracking-wide relative z-10">
                   Fraud Detection
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
         targetY={phoneTargetY}
         width={DEVICE_WIDTH}
         isVisible={showPhone}
         isBoosted={showAuthBoost}
         hasBilling={showBilling}
         hasRadar={showRadar}
       />
       
       {/* Terminal */}
       <SimulationDevice 
         id="terminal"
         image={terminalPos}
         x={POS_X}
         y={terminalY}
         targetY={terminalTargetY}
         width={DEVICE_WIDTH}
         isVisible={showTerminal}
         isBoosted={showAuthBoost}
         hasBilling={showBilling}
         hasRadar={showRadar}
       />
    </div>
  );
};
