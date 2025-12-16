import { Home, Users, BarChart3, FileText, Settings, Zap } from 'lucide-react';
import { View } from '../App';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const menuItems = [
  { id: 'dashboard' as View, icon: Home, label: 'Home' },
  { id: 'comparison' as View, icon: Users, label: 'Saved Comparisons' },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-200 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0061FF] to-[#0047B3] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Rimu</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#E8F0FF] text-[#0061FF]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Sections */}
        <div className="mt-8">
          <div className="px-3 mb-2 text-xs text-gray-500 uppercase tracking-wider">
            Quick Actions
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm">
              <FileText className="w-5 h-5" />
              Recent Assessments
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}