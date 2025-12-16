import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'primary';
  icon?: React.ReactNode;
}

export default function MetricCard({ 
  label, 
  value, 
  change, 
  changeLabel,
  variant = 'default',
  icon 
}: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -10px rgba(0, 97, 255, 0.1)' }}
      className={`bg-white rounded-xl p-6 border transition-all ${
        variant === 'primary'
          ? 'border-[#0061FF] bg-gradient-to-br from-[#F0F7FF] to-white'
          : 'border-gray-200 hover:border-[#0061FF]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-600">{label}</div>
        {icon && (
          <div className="text-[#0061FF]">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-3 mb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-3xl text-gray-900"
        >
          {value}
        </motion.div>
      </div>

      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-gray-500 ml-1">{changeLabel}</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
