import { motion } from 'framer-motion';

interface GradientPathProps {
  d: string;
  color: string;
}

/**
 * Animated connection path with shooting beam effect
 */
export const GradientPath = ({ d, color }: GradientPathProps) => {
  return (
    <>
      {/* 1. The Rail (Background Trace) */}
      <path
        d={d}
        stroke="#cbd5e1"
        strokeWidth="2"
        fill="none"
        strokeOpacity="0.4"
      />

      {/* 2. The Beam (Foreground Animation) */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
      />

      {/* 3. The Payload Pulse (The "Energy") */}
      <motion.circle
        r="4"
        fill={color}
        style={{
          offsetPath: `path('${d}')`,
          offsetDistance: 'var(--offset-distance, 0%)',
        }}
        initial={{ '--offset-distance': '0%' } as any}
        animate={{ '--offset-distance': '100%' } as any}
        transition={{
          duration: 2,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />
    </>
  );
};
