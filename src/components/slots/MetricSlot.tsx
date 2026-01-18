import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface MetricSlotProps {
  label?: string;
  value: string;
  trend?: string;
}

export const MetricSlot = ({ label = "NET VOLUME", value, trend = "+32.8%" }: MetricSlotProps) => {
  return (
    <div className="flex flex-col">
      <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
        {label}
      </h4>
      <div className="flex items-end gap-3">
        <motion.div
          key={value} // simplistic key for now, might animate better with pure numbers
          className="text-3xl font-bold text-slate-900 tracking-tight"
        >
          {value}
        </motion.div>
        <div className="flex items-center gap-1 text-emerald-500 text-sm font-semibold mb-1">
            <TrendingUp size={14} strokeWidth={3} />
            {trend}
        </div>
      </div>
    </div>
  );
};
