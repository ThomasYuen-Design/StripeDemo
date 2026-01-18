import { motion } from 'framer-motion';

interface GradientPathProps {
  d: string;
  gradientId: string;
}

/**
 * Animated connection path with Stripe-style gradient flow and glow effects
 *
 * Renders 2 layers:
 * 1. Rail - Subtle gray base path
 * 2. Gradient Beam - Animated path with color gradient
 */
export const GradientPath = ({ d, gradientId }: GradientPathProps) => {
  return (
    <g>
      {/* Rail - Subtle base */}
      <path
        d={d}
        stroke="#cbd5e1"
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gradient Beam - Sequenced Animation (Connect -> Hold -> Shoot) */}
      <motion.path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: "0 3000", strokeDashoffset: 0, opacity: 0 }}
        animate={{ 
          strokeDasharray: ["0 3000", "1000 3000", "1000 3000", "150 3000"],
          strokeDashoffset: [0, 0, 0, -1300],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 3.5, 
          times: [0, 0.2, 0.5, 1],
          ease: "easeInOut",
        }}
      />
    </g>
  );
};
