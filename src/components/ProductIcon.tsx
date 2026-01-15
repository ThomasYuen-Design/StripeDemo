import { motion } from 'framer-motion';
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
  return (
    <div
      className="absolute flex flex-col items-center gap-2"
      style={{
        left: `${(x / STAGE.width) * 100}%`,
        top: `${(y / STAGE.height) * 100}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ y: -5, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
          isActive
            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 ring-2 ring-offset-2 ring-slate-900'
            : 'bg-white text-slate-500 hover:text-slate-900 hover:shadow-xl'
        }`}
        aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${product.label}`}
        title={product.description}
      >
        <product.icon size={28} strokeWidth={1.5} />
        {isActive && (
          <motion.div
            layoutId={`active-dot-${product.id}`}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: product.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.button>
      <span
        className={`text-xs font-medium transition-colors ${
          isActive ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        {product.label}
      </span>
    </div>
  );
};
