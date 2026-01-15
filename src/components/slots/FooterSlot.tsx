import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  Repeat,
  ShieldCheck,
  Leaf,
  Flag,
} from 'lucide-react';
import type { ProductId } from '@/types';

interface FooterSlotProps {
  activeProducts: ProductId[];
}

export const FooterSlot = ({ activeProducts }: FooterSlotProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-slate-100">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
        <Activity size={12} />
        Payouts: Daily
      </div>

      <AnimatePresence>
        {activeProducts.includes('connect') && (
          <motion.div
            key="connect"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
          >
            <Users size={12} />
            Active Accounts: 142
          </motion.div>
        )}
        {activeProducts.includes('billing') && (
          <motion.div
            key="billing"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs font-medium"
          >
            <Repeat size={12} />
            Churn: 0.8%
          </motion.div>
        )}
        {activeProducts.includes('radar') && (
          <motion.div
            key="radar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium"
          >
            <ShieldCheck size={12} />
            Fraud Blocked
          </motion.div>
        )}
        {activeProducts.includes('climate') && (
          <motion.div
            key="climate"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium"
          >
            <Leaf size={12} />
            Removal: 1.5%
          </motion.div>
        )}
        {activeProducts.includes('atlas') && (
          <motion.div
            key="atlas"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium"
          >
            <Flag size={12} />
            Delaware C-Corp
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
