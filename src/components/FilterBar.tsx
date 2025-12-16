import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { SeniorityLevel } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLevel: SeniorityLevel | 'all';
  onLevelChange: (level: SeniorityLevel | 'all') => void;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills: string[];
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedSkills,
  onSkillsChange,
  availableSkills
}: FilterBarProps) {
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onLevelChange('all');
    onSkillsChange([]);
  };

  const hasActiveFilters = searchQuery || selectedLevel !== 'all' || selectedSkills.length > 0;

  return (
    <div className="bg-white px-8 py-5">
      <div className="flex items-center gap-4">
        {/* Search - Restored to larger width */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, skills, notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Skills Filter Dropdown - Now in position 2 */}
        <div className="relative">
          <button
            onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
            className={`px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all border ${
              selectedSkills.length > 0
                ? 'bg-[#0061FF] text-white border-[#0061FF]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Skills
            {selectedSkills.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {selectedSkills.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showSkillsDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSkillsDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
                >
                  <div className="p-4">
                    {/* Clear button at top - only show when filters are active */}
                    {selectedSkills.length > 0 && (
                      <button
                        onClick={() => onSkillsChange([])}
                        className="w-full mb-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Clear All Filters
                      </button>
                    )}
                    <div className="text-sm text-gray-900 mb-3">Filter by Skills</div>
                    <div className="space-y-2">
                      {availableSkills.slice(0, 20).map((skill) => (
                        <label
                          key={skill}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="w-4 h-4 text-[#0061FF] border-gray-300 rounded focus:ring-[#0061FF]"
                          />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Level Filter - Now in position 3 */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() => onLevelChange('all')}
            className={`px-4 py-1.5 rounded-md text-sm transition-all ${
              selectedLevel === 'all'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => onLevelChange('junior')}
            className={`px-4 py-1.5 rounded-md text-sm transition-all ${
              selectedLevel === 'junior'
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/50'
            }`}
            style={{
              color: selectedLevel === 'junior' ? 'var(--level-junior-dark)' : '#6b7280'
            }}
          >
            Junior
          </button>
          <button
            onClick={() => onLevelChange('mid')}
            className={`px-4 py-1.5 rounded-md text-sm transition-all ${
              selectedLevel === 'mid'
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/50'
            }`}
            style={{
              color: selectedLevel === 'mid' ? 'var(--level-mid-dark)' : '#6b7280'
            }}
          >
            Mid
          </button>
          <button
            onClick={() => onLevelChange('senior')}
            className={`px-4 py-1.5 rounded-md text-sm transition-all ${
              selectedLevel === 'senior'
                ? 'bg-white shadow-sm'
                : 'hover:bg-white/50'
            }`}
            style={{
              color: selectedLevel === 'senior' ? 'var(--level-senior-dark)' : '#6b7280'
            }}
          >
            Senior
          </button>
        </div>
      </div>

      {/* Active Filters Display - Moved to absolute positioning to not affect height */}
      <AnimatePresence>
        {selectedSkills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-3 flex-wrap overflow-hidden"
          >
            <span className="text-xs text-gray-500">Active filters:</span>
            {selectedSkills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[#0061FF]/10 text-[#0061FF] border border-[#0061FF]/20"
              >
                {skill}
                <button
                  onClick={() => toggleSkill(skill)}
                  className="hover:bg-[#0061FF]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}