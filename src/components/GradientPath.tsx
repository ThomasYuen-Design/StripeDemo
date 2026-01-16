import { motion } from 'framer-motion';

interface GradientPathProps {
  d: string;
  color: string;
  gradientId: string;
}

/**
 * Animated connection path with Stripe-style gradient flow and glow effects
 *
 * Renders 4 layers:
 * 1. Glow/Halo - Thick blurred path for subtle luminescence
 * 2. Rail - Subtle gray base path
 * 3. Gradient Beam - Animated path with color gradient
 * 4. Traveling Pulse - Energy circle moving along the path
 */
export const GradientPath = ({ d, color, gradientId }: GradientPathProps) => {
  return (
    <g>
      {/* LAYER 1: Glow/Halo - Thick + Blurred */}
      <path
        d={d}
        stroke={color}
        strokeWidth="12"
        fill="none"
        strokeOpacity="0.15"
        filter="url(#glow-blur)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* LAYER 2: Rail - Subtle base */}
      <path
        d={d}
        stroke="#cbd5e1"
        strokeWidth="2.5"
        fill="none"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* LAYER 3: Gradient Beam - Animated */}
      <motion.path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
      />

      {/* LAYER 4: Traveling Pulse - The "Energy" */}
      <motion.circle
        r="5"
        fill={color}
        filter="url(#pulse-glow)"
        style={{
          offsetPath: `path('${d}')`,
          offsetDistance: 'var(--offset-distance, 0%)',
        }}
        initial={{ '--offset-distance': '0%' } as any}
        animate={{ '--offset-distance': '100%' } as any}
        transition={{
          duration: 2.5,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0.3,
        }}
      />
    </g>
  );
};
