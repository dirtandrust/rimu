import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookmarkPlus, FileText, Mic, Linkedin, Globe, Code, Github } from 'lucide-react';
import { Assessment, SeniorityLevel } from '../types';
import { RUBRIC } from '../config/rubric';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Tooltip from './Tooltip';
import BaseDrawer from './BaseDrawer';

interface ComparisonDrawerProps {
  assessments: Assessment[];
  onClose: () => void;
  onSave: (name: string, assessmentIds: string[]) => void;
}

// Radial Gauge Component for Overall Score
function RadialGauge({
  score,
  size = 'medium',
}: {
  score: number;
  size?: 'small' | 'medium' | 'large';
}) {
  const sizeConfig = {
    small: { radius: 30, strokeWidth: 5, svgSize: 60, fontSize: 'text-base' },
    medium: { radius: 50, strokeWidth: 6, svgSize: 100, fontSize: 'text-2xl' },
    large: { radius: 60, strokeWidth: 8, svgSize: 120, fontSize: 'text-3xl' },
  };

  const config = sizeConfig[size];
  const normalizedRadius = config.radius - config.strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color based on score ranges
  const getColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green-500
    if (score >= 60) return '#3b82f6'; // blue-500
    if (score >= 40) return '#f59e0b'; // amber-500
    return '#9ca3af'; // gray-500
  };

  const strokeColor = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={config.svgSize} width={config.svgSize}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={config.strokeWidth}
          r={normalizedRadius}
          cx={config.radius}
          cy={config.radius}
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={config.radius}
          cy={config.radius}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.5s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${config.fontSize} text-gray-900`}>
          {score}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonDrawer({ assessments, onClose, onSave }: ComparisonDrawerProps) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [comparisonName, setComparisonName] = useState('');

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

  // Get all unique competencies across all levels
  const getAllCompetencies = () => {
    const competencies = new Map<string, { id: string; label: string; level: SeniorityLevel }>();
    
    (['junior', 'mid', 'senior'] as SeniorityLevel[]).forEach(level => {
      RUBRIC[level].competencies.forEach(comp => {
        if (!competencies.has(comp.id)) {
          competencies.set(comp.id, { id: comp.id, label: comp.label, level });
        }
      });
    });
    
    return Array.from(competencies.values());
  };

  const competencies = getAllCompetencies();

  const handleSaveComparison = () => {
    if (comparisonName.trim()) {
      onSave(comparisonName.trim(), assessments.map(a => a.id));
      setShowSaveModal(false);
      setComparisonName('');
    }
  };

  // Auto-generate comparison name based on candidates
  useEffect(() => {
    if (showSaveModal && !comparisonName) {
      const names = assessments.map(a => a.candidateName.split(' ')[0]).join(', ');
      setComparisonName(`Comparison: ${names}`);
    }
  }, [showSaveModal, assessments, comparisonName]);

  if (assessments.length === 0) {
    return null;
  }

  // Header content
  const header = (
    <div className="px-8 py-6 border-b border-gray-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-gray-900 mb-2">Candidate Comparison</h2>
          <p className="text-sm text-gray-600">
            Compare {assessments.length} candidates side-by-side
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </motion.button>
      </div>
    </div>
  );

  // Footer content with Save button
  const footer = (
    <div className="px-8 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
      <div className="text-sm text-gray-500">
        {assessments.length} {assessments.length === 1 ? 'candidate' : 'candidates'} selected
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSaveModal(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#0061FF] hover:bg-[#0052D6] text-white rounded-lg transition-colors shadow-sm"
      >
        <BookmarkPlus className="w-4 h-4" />
        Save Comparison
      </motion.button>
    </div>
  );

  return (
    <>
      <BaseDrawer
        isOpen={true}
        onClose={onClose}
        header={header}
        footer={footer}
      >
        <div className="p-8">
          {/* Unified Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header with Candidate Info */}
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-6 text-left align-top sticky left-0 bg-gray-50 z-10">
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Metric</div>
                    </th>
                    {assessments.map((assessment, index) => {
                      const bestFit = getBestFitLevel(assessment);
                      const overallScore = bestFit !== 'none' 
                        ? calculateLevelScore(assessment, bestFit) 
                        : Math.max(
                            calculateLevelScore(assessment, 'junior'),
                            calculateLevelScore(assessment, 'mid'),
                            calculateLevelScore(assessment, 'senior')
                          );

                      return (
                        <th key={assessment.id} className="px-6 py-6 text-center align-top min-w-[200px]">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center gap-3"
                          >
                            {/* Avatar with Links Tooltip */}
                            <Tooltip
                              content={
                                assessment.links ? (
                                  <div className="space-y-2">
                                    <div className="tooltip-label mb-2">{assessment.candidateName.split(' ')[0]}&apos;s links</div>
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
                              position="bottom"
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

                            {/* Name & Role */}
                            <div className="text-center">
                              <div className="text-gray-900 mb-1">{assessment.candidateName}</div>
                              {assessment.role && (
                                <div className="text-xs text-gray-600">{assessment.role}</div>
                              )}
                            </div>

                            {/* Level Badge */}
                            {bestFit !== 'none' ? (
                              <span 
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs border"
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
                                {bestFit.charAt(0).toUpperCase() + bestFit.slice(1)} Level
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                Pending
                              </span>
                            )}

                            {/* Overall Radial Gauge */}
                            <div className="mt-2">
                              <Tooltip
                                content={
                                  <div className="space-y-1">
                                    <div className="tooltip-label">Overall Score</div>
                                    <div className="tooltip-divider">
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="tooltip-value text-gray-300">Score:</span>
                                        <span className="tooltip-value">{overallScore}/100</span>
                                      </div>
                                      {bestFit !== 'none' && (
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="tooltip-value text-gray-300">Best Fit:</span>
                                          <span className="tooltip-value capitalize">{bestFit}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                }
                                width="standard"
                              >
                                <RadialGauge score={overallScore} size="medium" />
                              </Tooltip>
                            </div>
                          </motion.div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {/* Level Scores Section */}
                  <tr className="bg-gray-50">
                    <td colSpan={assessments.length + 1} className="px-6 py-3">
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Level Scores</div>
                    </td>
                  </tr>
                  
                  {(['junior', 'mid', 'senior'] as SeniorityLevel[]).map((level, levelIndex) => {
                    const threshold = RUBRIC[level].threshold;
                    
                    return (
                      <motion.tr
                        key={level}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + levelIndex * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 sticky left-0 bg-white z-10">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: level === 'senior'
                                  ? 'var(--level-senior)'
                                  : level === 'mid'
                                  ? 'var(--level-mid)'
                                  : 'var(--level-junior)'
                              }}
                            />
                            <div>
                              <div className="text-sm text-gray-900 capitalize">{level} Level</div>
                              <div className="text-xs text-gray-500">Threshold: {threshold}/100</div>
                            </div>
                          </div>
                        </td>
                        {assessments.map(assessment => {
                          const score = calculateLevelScore(assessment, level);
                          const met = score >= threshold;
                          
                          return (
                            <td key={assessment.id} className="px-6 py-4 text-center">
                              <Tooltip
                                content={
                                  <div className="space-y-1">
                                    <div className="tooltip-label capitalize">{level} Level</div>
                                    <div className="tooltip-divider">
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="tooltip-value text-gray-300">Score:</span>
                                        <span className="tooltip-value">{score}/100</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="tooltip-value text-gray-300">Threshold:</span>
                                        <span className="tooltip-value">{threshold}/100</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4 mt-1">
                                        <span className="tooltip-value text-gray-300">Status:</span>
                                        <span className={`tooltip-value ${met ? 'text-green-400' : 'text-gray-400'}`}>
                                          {met ? 'Met' : 'Not Met'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                }
                                width="standard"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <span className={`text-sm ${met ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {score}<span className="text-gray-400">/100</span>
                                  </span>
                                  <div className="w-full max-w-[120px] bg-gray-200 rounded-full h-2">
                                    <div
                                      className="h-2 rounded-full transition-all"
                                      style={{ 
                                        width: `${score}%`,
                                        backgroundColor: met 
                                          ? (level === 'senior' ? 'var(--level-senior)' : level === 'mid' ? 'var(--level-mid)' : 'var(--level-junior)')
                                          : '#9ca3af'
                                      }}
                                    />
                                  </div>
                                </div>
                              </Tooltip>
                            </td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}

                  {/* Competencies Section */}
                  <tr className="bg-gray-50">
                    <td colSpan={assessments.length + 1} className="px-6 py-3">
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Competency Breakdown</div>
                    </td>
                  </tr>

                  {competencies.map((competency, index) => {
                    const maxScore = RUBRIC[competency.level].competencies.find(c => c.id === competency.id)?.maxScore || 0;

                    return (
                      <motion.tr
                        key={competency.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 sticky left-0 bg-white z-10">
                          <div>
                            <div className="text-sm text-gray-900">{competency.label}</div>
                            <div 
                              className="text-xs capitalize"
                              style={{
                                color: competency.level === 'senior'
                                  ? 'var(--level-senior-dark)'
                                  : competency.level === 'mid'
                                  ? 'var(--level-mid-dark)'
                                  : 'var(--level-junior-dark)'
                              }}
                            >
                              {competency.level} level
                            </div>
                          </div>
                        </td>
                        {assessments.map(assessment => {
                          const score = assessment.scores[competency.level][competency.id] || 0;
                          const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

                          return (
                            <td key={assessment.id} className="px-6 py-4 text-center">
                              <Tooltip
                                content={
                                  <div className="space-y-1">
                                    <div className="tooltip-label">{competency.label}</div>
                                    <div className="tooltip-divider">
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="tooltip-value text-gray-300">Score:</span>
                                        <span className="tooltip-value">{score}/{maxScore}</span>
                                      </div>
                                      <div className="flex items-center justify-between gap-4">
                                        <span className="tooltip-value text-gray-300">Percentage:</span>
                                        <span className="tooltip-value">{Math.round(percentage)}%</span>
                                      </div>
                                    </div>
                                  </div>
                                }
                                width="standard"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-sm text-gray-900">
                                    {score}<span className="text-gray-500">/{maxScore}</span>
                                  </span>
                                  <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-[#0061FF] h-1.5 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </Tooltip>
                            </td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}

                  {/* Skills & Notes Section */}
                  <tr className="bg-gray-50">
                    <td colSpan={assessments.length + 1} className="px-6 py-3">
                      <div className="text-xs text-gray-600 uppercase tracking-wider">Additional Information</div>
                    </td>
                  </tr>

                  {/* Skills Row */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 sticky left-0 bg-white z-10">
                      <div className="text-sm text-gray-900">Skills</div>
                    </td>
                    {assessments.map(assessment => (
                      <td key={assessment.id} className="px-6 py-4 text-center">
                        {assessment.skills && assessment.skills.length > 0 ? (
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {assessment.skills.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-700 border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {assessment.skills.length > 2 && (
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
                        ) : (
                          <span className="text-xs text-gray-400">No skills listed</span>
                        )}
                      </td>
                    ))}
                  </motion.tr>

                  {/* Notes Row */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 sticky left-0 bg-white z-10">
                      <div className="text-sm text-gray-900">Notes</div>
                    </td>
                    {assessments.map(assessment => (
                      <td key={assessment.id} className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Text Notes Icon */}
                          {assessment.notes ? (
                            <Tooltip
                              content={
                                <div className="tooltip-value max-w-xs">
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
                                  <div className="tooltip-label mb-2">
                                    {assessment.audioNotes.length} audio {assessment.audioNotes.length === 1 ? 'note' : 'notes'}
                                  </div>
                                  {assessment.audioNotes.map((note, idx) => (
                                    <div key={note.id} className="tooltip-divider pb-2">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="tooltip-value text-gray-300">Note {idx + 1}</span>
                                        <span className="tooltip-value text-sm">
                                          {Math.floor(note.duration / 60)}:{(note.duration % 60).toString().padStart(2, '0')}
                                        </span>
                                      </div>
                                      {note.transcript && (
                                        <div className="tooltip-value text-sm text-gray-400 italic">
                                          &quot;{note.transcript}&quot;
                                        </div>
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
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                              <Mic className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </motion.tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </BaseDrawer>

      {/* Save Comparison Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <>
            <motion.div
              key="save-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setShowSaveModal(false)}
            />
            <motion.div
              key="save-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[100]"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900">Save Comparison</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSaveModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Comparison Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={comparisonName}
                      onChange={(e) => setComparisonName(e.target.value)}
                      placeholder="e.g. Senior Backend Candidates Q4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveComparison()}
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-2">Candidates in this comparison:</div>
                    <div className="space-y-1">
                      {assessments.map(a => (
                        <div key={a.id} className="text-sm text-gray-900">• {a.candidateName}</div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveComparison}
                      disabled={!comparisonName.trim()}
                      className={`flex-1 px-6 py-3 rounded-xl transition-colors text-sm ${
                        comparisonName.trim()
                          ? 'bg-[#0061FF] hover:bg-[#0052D6] text-white shadow-sm'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Save
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}