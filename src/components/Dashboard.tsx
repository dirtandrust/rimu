import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Users, TrendingUp, Clock, Activity, FileText, Linkedin, Globe, Code, Github, Mic, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MetricCard from './MetricCard';
import { Assessment, SeniorityLevel } from '../types';
import { RUBRIC } from '../config/rubric';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Tooltip from './Tooltip';
import AssessmentDrawer from './AssessmentDrawer';
import ComparisonDrawer from './ComparisonDrawer';
import NewAssessmentDrawer from './NewAssessmentDrawer';
import { getRelativeTime, formatDate } from '../utils/dateUtils';
import FilterBar from './FilterBar';
import SkeletonRow from './SkeletonRow';
import ContextMenu from './ContextMenu';

interface DashboardProps {
  assessments: Assessment[];
  onNewAssessment: (candidateName: string, role?: string, links?: { linkedin?: string; github?: string; portfolio?: string; codepen?: string; }) => Assessment;
  onSaveAssessment: (assessment: Assessment) => void;
  selectedForComparison: string[];
  onToggleComparison: (id: string) => void;
  onSaveComparison: (name: string, assessmentIds: string[]) => void;
  showNewAssessmentDrawer: boolean;
  onShowNewAssessmentDrawer: (show: boolean) => void;
}

export default function Dashboard({
  assessments,
  onNewAssessment,
  onSaveAssessment,
  selectedForComparison,
  onToggleComparison,
  onSaveComparison,
  showNewAssessmentDrawer,
  onShowNewAssessmentDrawer
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerAssessment, setDrawerAssessment] = useState<Assessment | null>(null);
  const [showComparisonDrawer, setShowComparisonDrawer] = useState(false);

  const handleStartNewAssessment = (data: { candidateName: string; role?: string; links?: { linkedin?: string; github?: string; portfolio?: string; codepen?: string; } }) => {
    // Create the new assessment
    const newAssessment = onNewAssessment(data.candidateName, data.role, data.links);
    // Return the new assessment so NewAssessmentDrawer can use it
    return newAssessment;
  };

  // Expose the drawer state to parent via callback
  useEffect(() => {
    if (onShowNewAssessmentDrawer && showNewAssessmentDrawer) {
      // We don't need to notify parent since we manage it internally
    }
  }, [showNewAssessmentDrawer, onShowNewAssessmentDrawer]);

  // Filter state
  const [selectedLevel, setSelectedLevel] = useState<SeniorityLevel | 'all'>('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Sorting state
  type SortColumn = 'name' | 'level' | 'score' | 'bestFit' | 'edited' | 'notes';
  type SortDirection = 'asc' | 'desc' | null;
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Lazy loading state
  const [displayCount, setDisplayCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const tableEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate best fit level for an assessment
  const getBestFitLevel = (assessment: Assessment): SeniorityLevel | 'none' => {
    const levels: SeniorityLevel[] = ['senior', 'mid', 'junior'];
    
    for (const level of levels) {
      const score = calculateLevelScore(assessment, level);
      const threshold = RUBRIC[level].threshold;
      if (score >= threshold) {
        return level;
      }
    }
    
    return 'none';
  };

  // Calculate overall score for a level
  const calculateLevelScore = (assessment: Assessment, level: SeniorityLevel): number => {
    const rubric = RUBRIC[level];
    const totalPossible = rubric.competencies.reduce((sum, comp) => sum + comp.maxScore, 0);
    const totalCurrent = rubric.competencies.reduce((sum, comp) => {
      const score = assessment.scores[level][comp.id] || 0;
      return sum + score;
    }, 0);
    
    return totalPossible > 0 ? Math.round((totalCurrent / totalPossible) * 100) : 0;
  };

  // Calculate metrics
  const totalAssessments = assessments.length;
  const assessmentsWithLevel = assessments.filter(a => getBestFitLevel(a) !== 'none').length;
  const successRate = totalAssessments > 0 ? Math.round((assessmentsWithLevel / totalAssessments) * 100) : 0;

  // Get all unique skills for the filter dropdown
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    assessments.forEach(a => {
      a.skills?.forEach(skill => skillSet.add(skill));
    });
    return Array.from(skillSet).sort();
  }, [assessments]);

  // Handle column sorting
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle through: asc -> desc -> null (no sort)
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      // New column, start with asc
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get sort icon for a column
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-4 h-4 text-[#0061FF]" />;
    }
    return <ArrowDown className="w-4 h-4 text-[#0061FF]" />;
  };

  // Apply all filters to get the complete filtered dataset
  const filteredAssessments = useMemo(() => {
    let result = assessments.filter(a => {
      // Search filter
      const matchesSearch = !searchQuery || 
        a.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.audioNotes?.some(note => note.transcript?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Level filter
      const matchesLevel = selectedLevel === 'all' || getBestFitLevel(a) === selectedLevel;
      
      // Skills filter
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.every(selectedSkill => a.skills?.includes(selectedSkill));
      
      return matchesSearch && matchesLevel && matchesSkills;
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        let compareValue = 0;

        switch (sortColumn) {
          case 'name':
            compareValue = a.candidateName.localeCompare(b.candidateName);
            break;

          case 'level': {
            const levelOrder = { senior: 3, mid: 2, junior: 1, none: 0 };
            const aLevel = getBestFitLevel(a);
            const bLevel = getBestFitLevel(b);
            compareValue = levelOrder[aLevel] - levelOrder[bLevel];
            break;
          }

          case 'score': {
            const aFit = getBestFitLevel(a);
            const bFit = getBestFitLevel(b);
            const aScore = aFit !== 'none' 
              ? calculateLevelScore(a, aFit) 
              : Math.max(
                  calculateLevelScore(a, 'junior'),
                  calculateLevelScore(a, 'mid'),
                  calculateLevelScore(a, 'senior')
                );
            const bScore = bFit !== 'none' 
              ? calculateLevelScore(b, bFit) 
              : Math.max(
                  calculateLevelScore(b, 'junior'),
                  calculateLevelScore(b, 'mid'),
                  calculateLevelScore(b, 'senior')
                );
            compareValue = aScore - bScore;
            break;
          }

          case 'bestFit': {
            const aFit = getBestFitLevel(a);
            const bFit = getBestFitLevel(b);
            const fitText = (level: SeniorityLevel | 'none') => {
              if (level === 'senior') return 'Senior Full-Stack Developer';
              if (level === 'mid') return 'Mid-Level Backend Developer';
              if (level === 'junior') return 'Junior Frontend Developer';
              return 'Assessment in progress';
            };
            compareValue = fitText(aFit).localeCompare(fitText(bFit));
            break;
          }

          case 'edited':
            compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;

          case 'notes': {
            const aNotesCount = (a.notes ? 1 : 0) + (a.audioNotes?.length || 0);
            const bNotesCount = (b.notes ? 1 : 0) + (b.audioNotes?.length || 0);
            compareValue = aNotesCount - bNotesCount;
            break;
          }
        }

        return sortDirection === 'asc' ? compareValue : -compareValue;
      });
    }

    return result;
  }, [assessments, searchQuery, selectedLevel, selectedSkills, sortColumn, sortDirection]);

  // Lazy loading: only display first N items from filtered results
  const displayedAssessments = useMemo(() => {
    return filteredAssessments.slice(0, displayCount);
  }, [filteredAssessments, displayCount]);

  const hasMore = displayCount < filteredAssessments.length;

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!hasMore || !tableEndRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Load 10 more items
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + 10, filteredAssessments.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (tableEndRef.current) {
      observerRef.current.observe(tableEndRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, filteredAssessments.length]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(10);
  }, [searchQuery, selectedLevel, selectedSkills]);

  return (
    <>
      {/* New Assessment Drawer */}
      <NewAssessmentDrawer
        isOpen={showNewAssessmentDrawer}
        onClose={() => onShowNewAssessmentDrawer(false)}
        onSubmit={handleStartNewAssessment}
        onSave={onSaveAssessment}
      />

      <div className="p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <h1 className="text-gray-900 mb-2">Welcome, Ronnie</h1>
          </div>
          {/* RESERVED SPACE FOR FUTURE CTA BUTTON - Currently hidden as Create button in TopBar handles this */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewAssessmentModal(true)}
            className="bg-[#0061FF] hover:bg-[#0052D6] text-white px-6 py-3 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            New Assessment
          </motion.button> */}
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total Assessments"
            value={totalAssessments}
            change={12}
            changeLabel="vs last month"
            icon={<Activity className="w-5 h-5" />}
          />
          <MetricCard
            label="Clear Level Match"
            value={`${successRate}%`}
            change={3.2}
            changeLabel="vs last month"
            variant="primary"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            label="Active Candidates"
            value={totalAssessments}
            changeLabel="in progress"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            label="Avg. Assessment Time"
            value="12min"
            changeLabel="per candidate"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Recent Assessments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Filter Bar or Context Menu - Fixed Height Container */}
          <div className="border-b border-gray-200">
            <AnimatePresence mode="wait">
              {selectedForComparison.length > 0 ? (
                <motion.div
                  key="context-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ContextMenu
                    selectedCount={selectedForComparison.length}
                    onClearSelection={() => {
                      selectedForComparison.forEach(id => onToggleComparison(id));
                    }}
                    onCompare={() => setShowComparisonDrawer(true)}
                    canCompare={selectedForComparison.length >= 2}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="filter-bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedLevel={selectedLevel}
                    onLevelChange={setSelectedLevel}
                    selectedSkills={selectedSkills}
                    onSkillsChange={setSelectedSkills}
                    availableSkills={availableSkills}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredAssessments.length === 0
                ? 'No assessments match your filters'
                : `Showing ${displayedAssessments.length} of ${filteredAssessments.length} ${filteredAssessments.length === 1 ? 'assessment' : 'assessments'}`}
            </p>
          </div>

          {filteredAssessments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-2">
                {searchQuery ? 'No assessments match your search' : 'No assessments yet'}
              </div>
              {!searchQuery && (
                <button
                  onClick={() => onShowNewAssessmentDrawer(true)}
                  className="text-[#0061FF] hover:underline"
                >
                  Create your first assessment
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <label className="inline-flex items-center justify-center cursor-pointer p-4 -m-4" data-checkbox-label>
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#0061FF] focus:ring-[#0061FF] cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) {
                              const ids = filteredAssessments.slice(0, 3).map(a => a.id);
                              ids.forEach(id => {
                                if (!selectedForComparison.includes(id)) {
                                  onToggleComparison(id);
                                }
                              });
                            } else {
                              filteredAssessments.forEach(a => {
                                if (selectedForComparison.includes(a.id)) {
                                  onToggleComparison(a.id);
                                }
                              });
                            }
                          }}
                        />
                      </label>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Name</span>
                        {getSortIcon('name')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('level')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Level</span>
                        {getSortIcon('level')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('score')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Score</span>
                        {getSortIcon('score')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('bestFit')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Best Fit</span>
                        {getSortIcon('bestFit')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('edited')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Edited</span>
                        {getSortIcon('edited')}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('notes')}
                        className="flex items-center gap-2 text-xs text-gray-600 uppercase tracking-wider hover:text-[#0061FF] transition-colors group"
                      >
                        <span>Notes</span>
                        {getSortIcon('notes')}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedAssessments.map((assessment, index) => {
                    const bestFit = getBestFitLevel(assessment);
                    // Calculate overall score - show actual progress even if no threshold is met
                    const overallScore = bestFit !== 'none' 
                      ? calculateLevelScore(assessment, bestFit) 
                      : Math.max(
                          calculateLevelScore(assessment, 'junior'),
                          calculateLevelScore(assessment, 'mid'),
                          calculateLevelScore(assessment, 'senior')
                        );
                    const isSelected = selectedForComparison.includes(assessment.id);
                    
                    // Only animate the first 10 items (initial page load)
                    // Lazy-loaded items appear instantly for smooth skeleton replacement
                    const shouldAnimate = index < 10;

                    // Create a unique key that includes score data to force re-render on changes
                    const scoreKey = JSON.stringify(assessment.scores);
                    const renderKey = `${assessment.id}-${scoreKey}`;

                    return (
                      <motion.tr
                        key={renderKey}
                        initial={shouldAnimate ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={shouldAnimate ? { delay: index * 0.05 } : { duration: 0 }}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => {
                          // Check if click is on checkbox or its label wrapper
                          const target = e.target as HTMLElement;
                          if (target.closest('input[type="checkbox"]') || target.closest('label[data-checkbox-label]')) {
                            return;
                          }
                          setDrawerAssessment(assessment);
                        }}
                      >
                        {/* Checkbox */}
                        <td className="px-6 py-4">
                          <label className="inline-flex items-center justify-center cursor-pointer p-4 -m-4" data-checkbox-label>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => onToggleComparison(assessment.id)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={!isSelected && selectedForComparison.length >= 3}
                              className="w-4 h-4 rounded border-gray-300 text-[#0061FF] focus:ring-[#0061FF] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            />
                          </label>
                        </td>

                        {/* Name with Avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Tooltip
                              content={
                                assessment.links ? (
                                  <div className="space-y-2">
                                    <div className="tooltip-label mb-2">{assessment.candidateName.split(' ')[0]}'s links</div>
                                    <div className="space-y-1.5">
                                      {assessment.links.linkedin && (
                                        <a
                                          href={assessment.links.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group pointer-events-auto"
                                        >
                                          <Linkedin className="w-4 h-4 text-blue-400" />
                                          <span className="tooltip-value text-sm group-hover:text-blue-300">LinkedIn</span>
                                        </a>
                                      )}
                                      {assessment.links.portfolio && (
                                        <a
                                          href={assessment.links.portfolio}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group pointer-events-auto"
                                        >
                                          <Globe className="w-4 h-4 text-green-400" />
                                          <span className="tooltip-value text-sm group-hover:text-green-300">Portfolio</span>
                                        </a>
                                      )}
                                      {assessment.links.codepen && (
                                        <a
                                          href={assessment.links.codepen}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group pointer-events-auto"
                                        >
                                          <Code className="w-4 h-4 text-yellow-400" />
                                          <span className="tooltip-value text-sm group-hover:text-yellow-300">CodePen</span>
                                        </a>
                                      )}
                                      {assessment.links.github && (
                                        <a
                                          href={assessment.links.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors group pointer-events-auto"
                                        >
                                          <Github className="w-4 h-4 text-purple-400" />
                                          <span className="tooltip-value text-sm group-hover:text-purple-300">GitHub</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ) : null
                              }
                              position="right"
                              width="narrow"
                              interactive={true}
                            >
                              {assessment.avatarUrl ? (
                                <ImageWithFallback
                                  src={assessment.avatarUrl}
                                  alt={assessment.candidateName}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0061FF] to-[#0047B3] flex items-center justify-center text-white text-sm">
                                  {assessment.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                              )}
                            </Tooltip>
                            <div>
                              <div className="text-sm text-gray-900">{assessment.candidateName}</div>
                              {assessment.role && (
                                <div className="text-xs text-gray-500">{assessment.role}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Level Badge */}
                        <td className="px-6 py-4">
                          {bestFit !== 'none' ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border`}
                              style={{
                                backgroundColor: bestFit === 'senior' 
                                  ? 'var(--level-senior-bg)' 
                                  : bestFit === 'mid' 
                                  ? 'var(--level-mid-bg)' 
                                  : 'var(--level-junior-bg)',
                                color: bestFit === 'senior'
                                  ? 'var(--level-senior-dark)'
                                  : bestFit === 'mid'
                                  ? 'var(--level-mid-dark)'
                                  : 'var(--level-junior-dark)',
                                borderColor: bestFit === 'senior'
                                  ? 'var(--level-senior-border)'
                                  : bestFit === 'mid'
                                  ? 'var(--level-mid-border)'
                                  : 'var(--level-junior-border)'
                              }}
                            >
                              {bestFit.charAt(0).toUpperCase() + bestFit.slice(1)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Score with Progress Bar */}
                        <td className="px-6 py-4">
                          <Tooltip
                            content={
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <span className="tooltip-label">Overall Score:</span>
                                  <span className="tooltip-value">{overallScore}/100</span>
                                </div>
                                {bestFit !== 'none' && (
                                  <div className="tooltip-divider">
                                    <div className="tooltip-label mb-1.5">Competency Breakdown:</div>
                                    {RUBRIC[bestFit].competencies.map((comp) => {
                                      const score = assessment.scores[bestFit][comp.id] || 0;
                                      return (
                                        <div key={comp.id} className="flex items-center justify-between gap-3 mb-1">
                                          <span className="tooltip-value text-gray-300">{comp.label}</span>
                                          <span className="tooltip-value">{score}/{comp.maxScore}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            }
                            width="standard"
                          >
                            <div className="flex items-center min-w-[100px] py-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${overallScore}%` }}
                                />
                              </div>
                            </div>
                          </Tooltip>
                        </td>

                        {/* Best Fit Description */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-[200px]">
                            {bestFit === 'senior' && 'Senior Full-Stack Developer'}
                            {bestFit === 'mid' && 'Mid-Level Backend Developer'}
                            {bestFit === 'junior' && 'Junior Frontend Developer'}
                            {bestFit === 'none' && 'Assessment in progress'}
                          </div>
                        </td>

                        {/* Skills Tags */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {assessment.skills?.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {assessment.skills && assessment.skills.length > 2 && (
                              <Tooltip
                                content={
                                  <div className="tooltip-value">
                                    {assessment.skills.join(', ')}
                                  </div>
                                }
                                width="standard"
                              >
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-500 border border-gray-200">
                                  +{assessment.skills.length - 2}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </td>

                        {/* Edited Date */}
                        <td className="px-6 py-4">
                          <Tooltip
                            content={
                              <div className="text-xs">Last edited: {formatDate(assessment.date)}</div>
                            }
                          >
                            <div className="text-sm text-gray-700">
                              {getRelativeTime(assessment.date)}
                            </div>
                          </Tooltip>
                        </td>

                        {/* Notes & Audio Icons */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Text Notes Icon */}
                            {assessment.notes ? (
                              <Tooltip
                                content={
                                  <div className="tooltip-value">
                                    {assessment.notes}
                                  </div>
                                }
                                position="left"
                                width="wide"
                              >
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                </div>
                              </Tooltip>
                            ) : (
                              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                                <FileText className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            
                            {/* Audio Notes Icon */}
                            {assessment.audioNotes && assessment.audioNotes.length > 0 ? (
                              <Tooltip
                                content={
                                  <div className="space-y-2">
                                    <div className="tooltip-label mb-2">{assessment.audioNotes.length} audio {assessment.audioNotes.length === 1 ? 'note' : 'notes'}</div>
                                    {assessment.audioNotes.map((note, idx) => (
                                      <div key={note.id} className="tooltip-divider pb-2">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                          <span className="tooltip-value text-gray-300">Note {idx + 1}</span>
                                          <span className="tooltip-value text-sm">{Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}</span>
                                        </div>
                                        {note.transcript && (
                                          <div className="tooltip-value text-sm text-gray-400 italic">"{note.transcript}"</div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                }
                                position="left"
                                width="wide"
                              >
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors relative">
                                  <Mic className="w-4 h-4 text-purple-600" />
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center">
                                    {assessment.audioNotes.length}
                                  </span>
                                </div>
                              </Tooltip>
                            ) : null}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {/* Skeleton Rows while loading more */}
                  {isLoadingMore && Array.from({ length: Math.min(10, filteredAssessments.length - displayCount) }).map((_, i) => (
                    <SkeletonRow key={`skeleton-${i}`} />
                  ))}
                </tbody>
              </table>
              
              {/* Lazy Loading Trigger */}
              {hasMore && !isLoadingMore && (
                <div ref={tableEndRef} className="h-4" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assessment Drawer */}
      <AssessmentDrawer
        assessment={drawerAssessment}
        assessments={filteredAssessments}
        onClose={() => setDrawerAssessment(null)}
        onSave={(updatedAssessment) => {
          onSaveAssessment(updatedAssessment);
        }}
        onNavigate={(assessment) => {
          setDrawerAssessment(assessment);
        }}
      />

      {/* Comparison Drawer */}
      {showComparisonDrawer && (
        <ComparisonDrawer
          assessments={assessments.filter(a => selectedForComparison.includes(a.id))}
          onClose={() => setShowComparisonDrawer(false)}
          onSave={(name, assessmentIds) => {
            onSaveComparison(name, assessmentIds);
            setShowComparisonDrawer(false);
          }}
        />
      )}
    </>
  );
}