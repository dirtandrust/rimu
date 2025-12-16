import { motion } from 'motion/react';
import { X, GitCompare, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  selectedCount: number;
  onClearSelection: () => void;
  onCompare: () => void;
  canCompare: boolean;
}

export default function ContextMenu({ selectedCount, onClearSelection, onCompare, canCompare }: ContextMenuProps) {
  return (
    <div className="bg-[#DBEAFE] px-8 py-5 flex items-center justify-between">
      {/* Left: Selection Count & Clear */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClearSelection}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/60 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </motion.button>
        <div className="text-gray-900 text-sm">
          <span className="font-medium">{selectedCount}</span> selected
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">
        {canCompare && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCompare}
            className="bg-[#0061FF] hover:bg-[#0052D6] text-white px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm text-sm"
          >
            <GitCompare className="w-4 h-4" />
            Compare Candidates
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 border border-gray-200 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </motion.button>
      </div>
    </div>
  );
}