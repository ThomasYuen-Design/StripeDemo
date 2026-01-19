import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductConfig } from '@/types';
import { STAGE } from '@/config/products';

interface ProductIconProps {
  product: ProductConfig;
  isActive: boolean;
  onClick: () => void;
  x: number;
  y: number;
}

export const ProductIcon = ({
  product,
  isActive,
  onClick,
  x,
  y,
}: ProductIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const showFilled = isHovered || isActive;
  const OutlineIcon = product.iconOutline;
  const FilledIcon = product.iconFilled;

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${(x / STAGE.width) * 100}%`,
        top: `${(y / STAGE.height) * 100}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
        className="relative"
        aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${product.label}`}
        title={product.description}
      >
        {/* Button container with fixed size and background */}
        <motion.div
          className="relative w-16 h-16 rounded-xl flex flex-col items-center justify-center border border-slate-200"
          animate={{
            backgroundColor: showFilled ? '#ffffff' : 'transparent',
            boxShadow: showFilled
              ? '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)'
              : '0 0 0 rgba(0, 0, 0, 0)',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Icon container - moves up and shrinks on hover/active */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              y: showFilled ? -6 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Outline Icon */}
            <motion.div
              className="absolute flex items-center justify-center text-slate-400"
              animate={{
                opacity: showFilled ? 0 : 1,
                scale: showFilled ? 0.8 : 1,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <OutlineIcon size={28} />
            </motion.div>

            {/* Filled Icon */}
            <AnimatePresence>
              {showFilled && (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 0.8 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <FilledIcon size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Product Label - appears below icon inside button */}
          <AnimatePresence>
            {showFilled && (
              <motion.div
                className="absolute bottom-2 flex items-center justify-center w-[52px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {product.label.length > 12 ? (
                  <div className="flex overflow-hidden mask-linear-fade w-full">
                    <motion.div
                      className="flex"
                      animate={{ x: '-50%' }}
                      transition={{
                        repeat: Infinity,
                        ease: 'linear',
                        duration: 5,
                        repeatType: "loop",
                        repeatDelay: 1.5
                      }}
                      style={{ width: "fit-content" }}
                    >
                      <span className="text-[10px] font-semibold text-slate-900 whitespace-nowrap pr-4">
                        {product.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-900 whitespace-nowrap pr-4">
                        {product.label}
                      </span>
                    </motion.div>
                  </div>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-900 whitespace-nowrap">
                    {product.label}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    </div>
  );
};
