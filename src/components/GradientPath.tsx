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
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Gradient Beam - Animated */}
      <motion.path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="square"
        strokeLinejoin="miter"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
      />
    </g>
  );
};
