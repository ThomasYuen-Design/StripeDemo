import { motion } from 'framer-motion';
import type { ProductId } from '@/types';

interface MetricSlotProps {
  activeProducts: ProductId[];
  revenue: number;
}

export const MetricSlot = ({ activeProducts, revenue }: MetricSlotProps) => {
  let label = 'Total Revenue';

  if (activeProducts.includes('connect')) {
    label = 'Gross Merchandise Value';
  } else if (activeProducts.includes('billing')) {
    label = 'Monthly Recurring Revenue (MRR)';
  }

  return (
    <div className="flex flex-col">
      <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
        {label}
      </h4>
      <motion.div
        key={label}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-mono text-slate-900 tracking-tighter"
      >
        $
        {revenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </motion.div>
      {activeProducts.includes('connect') && (
        <span className="text-xs text-slate-500 mt-1 font-mono">
          Net: ${(revenue * 0.15).toLocaleString()}
        </span>
      )}
    </div>
  );
};
