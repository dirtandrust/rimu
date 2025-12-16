import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import {
  X,
  Linkedin,
  Globe,
  Code,
  Github,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  Assessment,
  SeniorityLevel,
  AudioNote,
  Competency,
  LevelScore,
  QuestionWithRationale,
} from "../types";
import { RUBRIC } from "../config/rubric";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  formatDate,
  getRelativeTime,
} from "../utils/dateUtils";
import AudioNoteRecorder from "./AudioNoteRecorder";
import Tooltip from "./Tooltip";
import BaseDrawer from "./BaseDrawer";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { KeyboardKey } from "./KeyboardKey";

interface AssessmentDrawerProps {
  assessment: Assessment | null;
  assessments: Assessment[];
  onClose: () => void;
  onSave: (assessment: Assessment) => void;
  onNavigate: (assessment: Assessment) => void;
  skipAnimation?: boolean; // Skip entrance animation for instant transitions
}

// Common skills that can be suggested
const SUGGESTED_SKILLS = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "Go",
  "Rust",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST API",
  "Microservices",
  "CI/CD",
  "Git",
  "Vue.js",
  "Angular",
  "Next.js",
  "Express",
  "Django",
  "Flask",
  "Leadership",
  "Mentoring",
  "Agile",
  "Testing",
  "Security",
  "HTML",
  "CSS",
  "Tailwind",
  "Figma",
  "UX",
  "UI/UX",
  "SQL",
  "NoSQL",
  "Machine Learning",
  "AI",
  "Data Science",
  "Mobile",
  "iOS",
  "Android",
];

// Common tags that can be suggested
const SUGGESTED_TAGS = [
  "strong communicator",
  "team player",
  "independent worker",
  "leadership potential",
  "mentor",
  "detail-oriented",
  "creative thinker",
  "problem solver",
  "quick learner",
  "culture fit",
  "eager to learn",
  "needs mentorship",
  "self-starter",
  "adaptable",
  "analytical",
  "collaborative",
  "proactive",
  "reliable",
  "strategic thinker",
  "good social skills",
  "React Native",
  "Flutter",
];

// Draggable Score Slider Component
function DraggableScoreSlider({
  score,
  maxScore,
  onScoreChange,
}: {
  score: number;
  maxScore: number;
  onScoreChange: (score: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [localScore, setLocalScore] = useState(score);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const handleScale = useMotionValue(1);

  // Sync local score with prop
  React.useEffect(() => {
    setLocalScore(score);
  }, [score]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateScoreFromEvent(e);
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    updateScoreFromEvent(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Haptic feedback - scale bounce
    animate(handleScale, [1, 1.2, 1], {
      duration: 0.3,
      ease: "easeOut",
    });
    onScoreChange(localScore);
  };

  const updateScoreFromEvent = (e: any) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    // Map percentage to score (0 to maxScore)
    // If we have 4 max, we want positions at: 0%, 25%, 50%, 75%, 100% for scores 0, 1, 2, 3, 4
    const rawScore = Math.round(percentage * maxScore);
    const newScore = Math.max(0, Math.min(maxScore, rawScore));
    
    if (newScore !== localScore) {
      setLocalScore(newScore);
      // Micro haptic on each step
      animate(handleScale, [1, 1.1, 1], {
        duration: 0.15,
      });
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("touchend", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDrag);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, localScore]);

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const newScore = Math.min(maxScore, localScore + 1);
      setLocalScore(newScore);
      onScoreChange(newScore);
      animate(handleScale, [1, 1.2, 1], { duration: 0.2 });
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const newScore = Math.max(0, localScore - 1);
      setLocalScore(newScore);
      onScoreChange(newScore);
      animate(handleScale, [1, 1.2, 1], { duration: 0.2 });
    }
  };

  // Calculate handle position (score 0-maxScore maps to 0%-100%)
  const handlePosition = maxScore > 0 ? (localScore / maxScore) * 100 : 0;

  return (
    <div className="w-full space-y-3">
      {/* Score Label */}
      <div className="flex items-center justify-between">
        <motion.div
          style={{ scale: handleScale }}
          className="flex items-center gap-1.5 text-sm font-medium"
        >
          <span className="text-[#0061FF]">{localScore}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{maxScore}</span>
          <span className="text-gray-400 ml-1">
            {localScore === 0 ? "Not scored" : `question${localScore !== 1 ? "s" : ""}`}
          </span>
        </motion.div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full h-12 flex items-center cursor-pointer group"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={maxScore}
        aria-valuenow={localScore}
      >
        {/* Background Track */}
        <div className="absolute w-full h-3 bg-gray-200 rounded-full" />
        
        {/* Filled Track */}
        <div
          className="absolute h-3 bg-[#0061FF] rounded-full transition-all duration-150"
          style={{ width: `${handlePosition}%` }}
        />

        {/* Step Markers - More Subtle */}
        {Array.from({ length: maxScore + 1 }).map((_, i) => {
          const position = maxScore > 0 ? (i / maxScore) * 100 : 0;
          const isActive = i <= localScore;
          return (
            <div
              key={i}
              className={`absolute w-0.5 h-0.5 rounded-full -translate-x-1/2 z-10 transition-opacity ${
                isActive ? "opacity-30" : "opacity-20"
              }`}
              style={{ 
                left: `${position}%`,
                backgroundColor: isActive ? "#fff" : "#9CA3AF"
              }}
            />
          );
        })}

        {/* Draggable Handle */}
        <motion.div
          style={{
            left: `${handlePosition}%`,
            scale: handleScale,
          }}
          className={`absolute w-7 h-7 bg-white border-2 border-[#0061FF] rounded-full shadow-lg -translate-x-1/2 z-20 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          whileHover={{ scale: 1.2 }}
        >
          {/* Inner dot for better visibility */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#0061FF] rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Small Radial Gauge Component for Tabs
function SmallRadialGauge({
  level,
  score,
  threshold,
  met,
}: {
  level: SeniorityLevel;
  score: number;
  threshold: number;
  met: boolean;
}) {
  const radius = 30;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (score / 100) * circumference;

  const levelStyles = {
    junior: {
      strokeColor: "var(--level-junior)",
      textColor: "var(--level-junior-dark)",
    },
    mid: {
      strokeColor: "var(--level-mid)",
      textColor: "var(--level-mid-dark)",
    },
    senior: {
      strokeColor: "var(--level-senior)",
      textColor: "var(--level-senior-dark)",
    },
  };

  const style = levelStyles[level];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={60} width={60}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={met ? style.strokeColor : "#9ca3af"}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            stroke: met ? style.strokeColor : "#9ca3af",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-lg"
          style={{ color: met ? style.textColor : "#374151" }}
        >
          {score}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentDrawer({
  assessment,
  assessments,
  onClose,
  onSave,
  onNavigate,
  skipAnimation = false,
}: AssessmentDrawerProps) {
  const [selectedLevel, setSelectedLevel] =
    useState<SeniorityLevel>("senior");
  const [scores, setScores] = useState(
    assessment?.scores || { junior: {}, mid: {}, senior: {} },
  );
  const [notes, setNotes] = useState(assessment?.notes || "");
  const [skills, setSkills] = useState<string[]>(
    assessment?.skills || [],
  );
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] =
    useState(false);
  const [tags, setTags] = useState<string[]>(
    assessment?.tags || [],
  );
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] =
    useState(false);
  const [audioNotes, setAudioNotes] = useState<AudioNote[]>(
    assessment?.audioNotes || [],
  );
  
  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track if there are silent changes (notes, skills, audio) that haven't shown a toast yet
  const hasSilentChangesRef = useRef<boolean>(false);

  // Initialize all competencies as expanded by default
  const [expandedCompetencies, setExpandedCompetencies] =
    useState<Record<string, boolean>>(() => {
      const initial: Record<string, boolean> = {};
      Object.values(RUBRIC).forEach((rubric) => {
        rubric.competencies.forEach((comp) => {
          initial[comp.id] = true; // All expanded by default
        });
      });
      return initial;
    });

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (assessment) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [assessment]);

  // Update local state when assessment changes
  useEffect(() => {
    if (assessment) {
      setScores(assessment.scores);
      setNotes(assessment.notes);
      setSkills(assessment.skills || []);
      setAudioNotes(assessment.audioNotes || []);

      // Set default selected level to the met threshold, or mid if none met
      const tempScores = assessment.scores;
      const calculateScore = (level: SeniorityLevel) => {
        const rubric = RUBRIC[level];
        const totalPossible = rubric.competencies.reduce(
          (sum, comp) => sum + comp.maxScore,
          0,
        );
        const totalCurrent = rubric.competencies.reduce(
          (sum, comp) => {
            const score = tempScores[level][comp.id] || 0;
            return sum + score;
          },
          0,
        );
        return totalPossible > 0
          ? Math.round((totalCurrent / totalPossible) * 100)
          : 0;
      };

      // Check thresholds from highest to lowest
      const seniorScore = calculateScore("senior");
      const midScore = calculateScore("mid");
      const juniorScore = calculateScore("junior");

      if (seniorScore >= RUBRIC.senior.threshold) {
        setSelectedLevel("senior");
      } else if (midScore >= RUBRIC.mid.threshold) {
        setSelectedLevel("mid");
      } else if (juniorScore >= RUBRIC.junior.threshold) {
        setSelectedLevel("junior");
      } else {
        setSelectedLevel("mid"); // Default to mid if no threshold is met
      }
    }
  }, [assessment?.id]);

  // Calculate score for a specific level (0-100)
  const calculateLevelScore = (
    level: SeniorityLevel,
  ): number => {
    const rubric = RUBRIC[level];
    const totalPossible = rubric.competencies.reduce(
      (sum, comp) => sum + comp.maxScore,
      0,
    );
    const totalCurrent = rubric.competencies.reduce(
      (sum, comp) => {
        const score = scores[level][comp.id] || 0;
        return sum + score;
      },
      0,
    );

    return totalPossible > 0
      ? Math.round((totalCurrent / totalPossible) * 100)
      : 0;
  };

  // Calculate all level scores
  const levelScores: LevelScore[] = useMemo(() => {
    if (!assessment) return [];
    return (
      ["junior", "mid", "senior"] as SeniorityLevel[]
    ).map((level) => {
      const score = calculateLevelScore(level);
      const threshold = RUBRIC[level].threshold;
      return {
        level,
        score,
        threshold,
        met: score >= threshold,
      };
    });
  }, [scores, assessment]);

  // Determine overall status
  const overallStatus = useMemo(() => {
    if (!assessment || levelScores.length === 0)
      return { text: "", level: null };
    if (levelScores[2].met)
      return {
        text: "Meets Senior threshold",
        level: "senior" as SeniorityLevel,
      };
    if (levelScores[1].met)
      return {
        text: "Meets Mid threshold",
        level: "mid" as SeniorityLevel,
      };
    if (levelScores[0].met)
      return {
        text: "Meets Junior threshold",
        level: "junior" as SeniorityLevel,
      };
    return {
      text: "Below all thresholds – no clear level yet",
      level: null,
    };
  }, [levelScores, assessment]);

  // Auto-save with debouncing - hooks must be before conditional returns
  const handleSave = useCallback(() => {
    if (!assessment) return;
    onSave({
      ...assessment,
      scores,
      notes,
      skills,
      tags,
      audioNotes,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, scores, notes, skills, tags, audioNotes]);

  // Trigger auto-save with debouncing
  const triggerAutoSave = useCallback((message: string, type: 'success' | 'info' = 'success', silent: boolean = false) => {
    // Mark silent changes IMMEDIATELY (not after debounce)
    if (silent) {
      hasSilentChangesRef.current = true;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for debounced save
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
      
      if (!silent) {
        // Show toast notification immediately for non-silent changes
        if (type === 'success') {
          toast.success(message, {
            duration: 2000,
            position: 'bottom-left',
          });
        } else {
          toast.info(message, {
            duration: 2000,
            position: 'bottom-left',
          });
        }
      }
    }, 800); // 800ms debounce
  }, [handleSave]);

  // Handle drawer close with confirmation toast for silent changes
  const handleClose = useCallback(() => {
    // Clear any pending auto-save timers
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Save any pending changes immediately
    handleSave();
    
    // Show confirmation toast if there were silent changes
    if (hasSilentChangesRef.current) {
      toast.success('Changes saved', {
        duration: 2000,
        position: 'bottom-left',
      });
      hasSilentChangesRef.current = false;
    }
    
    onClose();
  }, [handleSave, onClose]);

  // Cleanup timer on unmount and show confirmation if needed
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      // On unmount (e.g., browser close), save changes
      if (hasSilentChangesRef.current) {
        // Browser is closing, we can't show toast but data is saved
        handleSave();
      }
    };
  }, [handleSave]);

  // Find the index of the current assessment in the assessments array
  const currentIndex = assessments.findIndex(
    (a) => a?.id === assessment?.id,
  );
  const previousAssessment =
    currentIndex > 0 ? assessments[currentIndex - 1] : null;
  const nextAssessment =
    currentIndex < assessments.length - 1
      ? assessments[currentIndex + 1]
      : null;

  // Keyboard Navigation - must be called before any conditional returns
  useKeyboardNavigation({
    onPrevious: () => {
      if (previousAssessment) {
        // Save immediately on navigation
        handleSave();
        onNavigate(previousAssessment);
      }
    },
    onNext: () => {
      if (nextAssessment) {
        // Save immediately on navigation
        handleSave();
        onNavigate(nextAssessment);
      }
    },
    onEscape: handleClose,
    enabled: !!assessment,
  });

  if (!assessment) return null;

  // Update a competency score
  const updateScore = (competencyId: string, delta: number) => {
    const competency = RUBRIC[selectedLevel].competencies.find(
      (c) => c.id === competencyId,
    );
    if (!competency) return;

    const currentScore =
      scores[selectedLevel][competencyId] || 0;
    const newScore = Math.max(
      0,
      Math.min(competency.maxScore, currentScore + delta),
    );

    setScores({
      ...scores,
      [selectedLevel]: {
        ...scores[selectedLevel],
        [competencyId]: newScore,
      },
    });
    
    triggerAutoSave(`Score updated: ${competency.label} set to ${newScore}/${competency.maxScore}`);
  };

  // Get current score for a competency
  const getCompetencyScore = (competencyId: string): number => {
    return scores[selectedLevel][competencyId] || 0;
  };

  // Calculate progress percentage for a competency
  const getCompetencyProgress = (
    competency: Competency,
  ): number => {
    const score = getCompetencyScore(competency.id);
    return (score / competency.maxScore) * 100;
  };

  const currentRubric = RUBRIC[selectedLevel];

  return (
    <AnimatePresence>
      {assessment && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: skipAnimation ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: "easeOut",
              duration: skipAnimation ? 0 : 0.24, // 20% faster than 0.3s default
            }}
            className="fixed right-0 top-0 h-full w-[60%] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-[32px] py-[24px] border-b border-gray-200 bg-white pt-[16px] pr-[32px] pb-[0px] pl-[32px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {assessment.avatarUrl && (
                    <ImageWithFallback
                      src={assessment.avatarUrl}
                      alt={assessment.candidateName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <div>
                    <h2 className="text-gray-900 mb-0">
                      {assessment.candidateName}
                    </h2>
                    {assessment.role && (
                      <p className="text-sm text-gray-500">
                        {assessment.role}
                      </p>
                    )}
                  </div>
                  {/* Social Links - moved to right of name/role */}
                  {assessment.links && (
                    <div className="flex items-center gap-2 ml-6">
                      {assessment.links.linkedin && (
                        <a
                          href={assessment.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-[#0077B5] hover:text-white transition-colors text-gray-600"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {assessment.links.github && (
                        <a
                          href={assessment.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white transition-colors text-gray-600"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {assessment.links.portfolio && (
                        <a
                          href={assessment.links.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-[#0061FF] hover:text-white transition-colors text-gray-600"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {assessment.links.codepen && (
                        <a
                          href={assessment.links.codepen}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-900 hover:text-white transition-colors text-gray-600"
                        >
                          <Code className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-row-reverse gap-6 p-8">
                {/* Right Column: Assessment Controls (grows to fill space) - visually on right due to flex-row-reverse */}
                <div className="flex-1 space-y-6">
                  {/* Level Selector Tabs with Integrated Small Gauges - Sticky */}
                  <div className="sticky top-0 z-30 bg-[#F7F9FC] pb-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-3">
                      {(
                        [
                          "junior",
                          "mid",
                          "senior",
                        ] as SeniorityLevel[]
                      ).map((level, index) => {
                        const levelScore = levelScores[index];
                        const isSelected =
                          selectedLevel === level;
                        const isMet = levelScore.met;

                        // Define level-specific colors
                        const levelColors = {
                          junior: {
                            border: "var(--level-junior)",
                            bg: "var(--level-junior-bg)",
                            text: "var(--level-junior-dark)",
                          },
                          mid: {
                            border: "var(--level-mid)",
                            bg: "var(--level-mid-bg)",
                            text: "var(--level-mid-dark)",
                          },
                          senior: {
                            border: "var(--level-senior)",
                            bg: "var(--level-senior-bg)",
                            text: "var(--level-senior-dark)",
                          },
                        };

                        const colors = levelColors[level];

                        return (
                          <motion.button
                            key={level}
                            whileHover={{ y: -2 }}
                            onClick={() =>
                              setSelectedLevel(level)
                            }
                            className="px-6 py-5 flex items-center justify-between gap-4 transition-all border-b-2"
                            style={{
                              borderColor: isSelected
                                ? isMet
                                  ? colors.border
                                  : "#0061FF"
                                : "transparent",
                              backgroundColor: isSelected
                                ? isMet
                                  ? colors.bg
                                  : "rgba(0, 97, 255, 0.05)"
                                : "transparent",
                            }}
                          >
                            <div className="flex flex-col items-start gap-1">
                              <div
                                className="capitalize"
                                style={{
                                  color: isSelected
                                    ? isMet
                                      ? colors.text
                                      : "#0061FF"
                                    : "#6b7280",
                                }}
                              >
                                {level}
                              </div>
                              {levelScore.met && (
                                <div className="flex items-center gap-1 text-xs" style={{ color: colors.text }}>
                                  <span>✓</span>
                                  <span>Met</span>
                                </div>
                              )}
                            </div>
                            <SmallRadialGauge
                              level={level}
                              score={levelScore.score}
                              threshold={levelScore.threshold}
                              met={levelScore.met}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  </div>

                  {/* Competencies */}
                  <div className="space-y-4">
                    {currentRubric.competencies.map(
                      (competency, index) => {
                        const score = getCompetencyScore(
                          competency.id,
                        );
                        const progress =
                          getCompetencyProgress(competency);
                        const expanded =
                          expandedCompetencies[competency.id] ||
                          false;

                        return (
                          <div
                            key={competency.id}
                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                          >
                            <div className="space-y-4">
                              {/* Competency Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <h3 className="text-gray-900">
                                    {competency.label}
                                  </h3>
                                  <Tooltip
                                    content={
                                      <div>
                                        {competency.id ===
                                          "technical_depth" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>
                                                What it
                                                measures:
                                              </strong>{" "}
                                              The candidate's
                                              depth of technical
                                              knowledge,
                                              architectural
                                              understanding, and
                                              ability to work
                                              with complex
                                              systems.
                                            </div>
                                            <div className="mb-2">
                                              <strong>
                                                Why it matters:
                                              </strong>{" "}
                                              Deeper technical
                                              knowledge means
                                              fewer blockers,
                                              better design
                                              decisions, and
                                              ability to mentor
                                              others. Candidates
                                              with strong
                                              technical depth
                                              can solve harder
                                              problems and adapt
                                              to new
                                              technologies
                                              faster.
                                            </div>
                                            <div>
                                              <strong>
                                                Red flags:
                                              </strong>{" "}
                                              Surface-level
                                              answers, inability
                                              to explain
                                              trade-offs, or
                                              only knowing one
                                              way to solve
                                              problems indicates
                                              limited depth.
                                            </div>
                                          </>
                                        )}
                                        {competency.id ===
                                          "problem_solving" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>
                                                What it
                                                measures:
                                              </strong>{" "}
                                              How candidates
                                              approach
                                              unfamiliar
                                              challenges, break
                                              down complex
                                              problems, and
                                              think through
                                              solutions
                                              systematically.
                                            </div>
                                            <div className="mb-2">
                                              <strong>
                                                Why it matters:
                                              </strong>{" "}
                                              Developers spend
                                              most of their time
                                              solving problems,
                                              not writing code.
                                              Strong
                                              problem-solvers
                                              are
                                              self-sufficient,
                                              creative under
                                              constraints, and
                                              find elegant
                                              solutions that
                                              save time and
                                              money.
                                            </div>
                                            <div>
                                              <strong>
                                                Red flags:
                                              </strong>{" "}
                                              Giving up easily,
                                              needing excessive
                                              guidance, or only
                                              solving problems
                                              they've seen
                                              before shows weak
                                              problem-solving
                                              muscles.
                                            </div>
                                          </>
                                        )}
                                        {competency.id ===
                                          "autonomy" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>
                                                What it
                                                measures:
                                              </strong>{" "}
                                              The candidate's
                                              ability to take
                                              ownership, work
                                              independently,
                                              make decisions,
                                              and drive projects
                                              forward without
                                              constant
                                              supervision.
                                            </div>
                                            <div className="mb-2">
                                              <strong>
                                                Why it matters:
                                              </strong>{" "}
                                              Autonomous
                                              developers
                                              multiply your
                                              team's capacity.
                                              They unblock
                                              themselves, take
                                              initiative on
                                              improvements, and
                                              reduce management
                                              overhead. Lower
                                              autonomy means
                                              constant
                                              hand-holding and
                                              slower delivery.
                                            </div>
                                            <div>
                                              <strong>
                                                Red flags:
                                              </strong>{" "}
                                              Waiting for
                                              instructions,
                                              avoiding
                                              decisions, or
                                              blaming external
                                              factors instead of
                                              taking ownership
                                              indicates
                                              dependency issues.
                                            </div>
                                          </>
                                        )}
                                        {competency.id ===
                                          "communication" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>
                                                What it
                                                measures:
                                              </strong>{" "}
                                              How clearly
                                              candidates explain
                                              technical
                                              concepts,
                                              collaborate with
                                              teammates, and
                                              document their
                                              work.
                                            </div>
                                            <div className="mb-2">
                                              <strong>
                                                Why it matters:
                                              </strong>{" "}
                                              Poor communicators
                                              create
                                              bottlenecks,
                                              misaligned work,
                                              and team friction.
                                              Strong
                                              communicators
                                              enable async work,
                                              onboard faster,
                                              and bridge
                                              technical and
                                              non-technical
                                              stakeholders
                                              effectively.
                                            </div>
                                            <div>
                                              <strong>
                                                Red flags:
                                              </strong>{" "}
                                              Overly technical
                                              jargon, inability
                                              to simplify
                                              concepts, or
                                              defensive
                                              reactions to
                                              questions signal
                                              communication
                                              challenges ahead.
                                            </div>
                                          </>
                                        )}
                                        {![
                                          "technical_depth",
                                          "problem_solving",
                                          "autonomy",
                                          "communication",
                                        ].includes(
                                          competency.id,
                                        ) && (
                                          <>
                                            <div className="mb-2">
                                              <strong>
                                                What it
                                                measures:
                                              </strong>{" "}
                                              This competency
                                              evaluates specific
                                              skills and
                                              behaviors that
                                              indicate the
                                              candidate's fit
                                              for the role.
                                            </div>
                                            <div className="mb-2">
                                              <strong>
                                                Why it matters:
                                              </strong>{" "}
                                              Each competency
                                              reflects
                                              real-world job
                                              requirements and
                                              helps you make
                                              data-driven hiring
                                              decisions based on
                                              evidence, not gut
                                              feeling.
                                            </div>
                                            <div>
                                              <strong>
                                                Red flags:
                                              </strong>{" "}
                                              Look for
                                              inconsistencies in
                                              their answers,
                                              lack of specific
                                              examples, or
                                              inability to
                                              demonstrate
                                              practical
                                              application of
                                              their claimed
                                              skills.
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    }
                                    position="bottom"
                                    width="wide"
                                  >
                                    <button
                                      onClick={() =>
                                        setExpandedCompetencies(
                                          {
                                            ...expandedCompetencies,
                                            [competency.id]:
                                              !expanded,
                                          },
                                        )
                                      }
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <HelpCircle className="w-4 h-4" />
                                    </button>
                                  </Tooltip>
                                </div>
                              </div>

                              {/* Draggable Score Slider */}
                              <DraggableScoreSlider
                                score={score}
                                maxScore={competency.maxScore}
                                onScoreChange={(newScore) => {
                                  setScores({
                                    ...scores,
                                    [selectedLevel]: {
                                      ...scores[selectedLevel],
                                      [competency.id]: newScore,
                                    },
                                  });
                                  // Mark as silent so "Changes saved" toast shows on drawer close
                                  triggerAutoSave(`Score updated: ${competency.label} set to ${newScore}/${competency.maxScore}`, 'success', true);
                                }}
                              />

                              {/* Sample Questions */}
                              {expanded && (
                                <div
                                  className="pt-4 border-t border-gray-200"
                                >
                                  <div className="text-sm text-gray-600 mb-3">
                                    Sample questions to ask:
                                  </div>
                                  <ul className="space-y-2">
                                    {competency.sampleQuestions.map(
                                      (item, idx) => {
                                        // Handle both string and QuestionWithRationale formats
                                        const questionText =
                                          typeof item ===
                                          "string"
                                            ? item
                                            : item.question;
                                        const rationale =
                                          typeof item ===
                                          "string"
                                            ? null
                                            : item.rationale;

                                        return (
                                          <li
                                            key={idx}
                                            className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg"
                                          >
                                            <span className="text-[#0061FF] font-medium flex-shrink-0">
                                              {idx + 1}.
                                            </span>
                                            <span className="flex-1">
                                              {questionText}
                                            </span>
                                            {rationale && (
                                              <div className="relative group flex-shrink-0">
                                                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#0061FF] transition-colors" />
                                                <div className="absolute right-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                                  <div className="mb-1.5 text-[#60A5FA]">
                                                    Why ask
                                                    this?
                                                  </div>
                                                  <div className="leading-relaxed">
                                                    {rationale}
                                                  </div>
                                                  <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                </div>
                                              </div>
                                            )}
                                          </li>
                                        );
                                      },
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Left Column: Skills & Notes (fixed width) - visually on left due to flex-row-reverse */}
                <div className="w-[400px] flex-shrink-0 space-y-6">
                  {/* Skills */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-gray-900">Skills</h3>
                      <Tooltip
                        content="Add skills to categorize this candidate and make them easier to filter and search."
                        position="right"
                        width="standard"
                      >
                        <div className="text-gray-400 hover:text-gray-600 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                      </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-[#0061FF]/10 text-[#0061FF] border border-[#0061FF]/20"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              setSkills(
                                skills.filter(
                                  (_, i) => i !== idx,
                                ),
                              );
                              triggerAutoSave('', 'success', true); // Silent save
                            }}
                            className="hover:bg-[#0061FF]/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => {
                          setSkillInput(e.target.value);
                          setShowSkillSuggestions(
                            e.target.value.length > 0,
                          );
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            skillInput.trim()
                          ) {
                            if (
                              !skills.includes(
                                skillInput.trim(),
                              )
                            ) {
                              setSkills([
                                ...skills,
                                skillInput.trim(),
                              ]);
                              triggerAutoSave('', 'success', true); // Silent save
                            }
                            setSkillInput("");
                            setShowSkillSuggestions(false);
                          }
                        }}
                        placeholder="Add a skill (press Enter)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all"
                      />

                      {/* Skill Suggestions */}
                      {showSkillSuggestions && skillInput && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        >
                          {SUGGESTED_SKILLS.filter(
                            (skill) =>
                              skill
                                .toLowerCase()
                                .includes(
                                  skillInput.toLowerCase(),
                                ) && !skills.includes(skill),
                          )
                            .slice(0, 8)
                            .map((skill, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSkills([...skills, skill]);
                                  setSkillInput("");
                                  setShowSkillSuggestions(
                                    false,
                                  );
                                  triggerAutoSave('', 'success', true); // Silent save
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                              >
                                {skill}
                              </button>
                            ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Custom Tags */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-gray-900">Custom Tags</h3>
                      <Tooltip
                        content="Add custom tags to group candidates and make them easier to search (e.g., 'good social skills', 'team player')."
                        position="right"
                        width="standard"
                      >
                        <div className="text-gray-400 hover:text-gray-600 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                      </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-50 text-purple-700 border border-purple-200"
                        >
                          {tag}
                          <button
                            onClick={() => {
                              setTags(
                                tags.filter(
                                  (_, i) => i !== idx,
                                ),
                              );
                              triggerAutoSave('', 'success', true); // Silent save
                            }}
                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value);
                          setShowTagSuggestions(
                            e.target.value.length > 0,
                          );
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            tagInput.trim()
                          ) {
                            if (
                              !tags.includes(
                                tagInput.trim(),
                              )
                            ) {
                              setTags([
                                ...tags,
                                tagInput.trim(),
                              ]);
                              triggerAutoSave('', 'success', true); // Silent save
                            }
                            setTagInput("");
                            setShowTagSuggestions(false);
                          }
                        }}
                        placeholder="Add a custom tag (press Enter)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all"
                      />

                      {/* Tag Suggestions */}
                      {showTagSuggestions && tagInput && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        >
                          {SUGGESTED_TAGS.filter(
                            (tag) =>
                              tag
                                .toLowerCase()
                                .includes(
                                  tagInput.toLowerCase(),
                                ) && !tags.includes(tag),
                          )
                            .slice(0, 8)
                            .map((tag, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setTags([...tags, tag]);
                                  setTagInput("");
                                  setShowTagSuggestions(
                                    false,
                                  );
                                  triggerAutoSave('', 'success', true); // Silent save
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Text Notes */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-gray-900 mb-4">
                      Text Notes
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        triggerAutoSave('', 'info', true); // Silent save
                      }}
                      placeholder="Add observations about this candidate..."
                      className="w-full h-[200px] px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  {/* Audio Notes */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-gray-900 mb-4">
                      Audio Notes
                    </h3>
                    <AudioNoteRecorder
                      audioNotes={audioNotes}
                      onAddNote={(note) => {
                        setAudioNotes([...audioNotes, note]);
                        triggerAutoSave('', 'success', true); // Silent save
                      }}
                      onDeleteNote={(noteId) => {
                        setAudioNotes(
                          audioNotes.filter(
                            (n) => n.id !== noteId,
                          ),
                        );
                        triggerAutoSave('', 'success', true); // Silent save
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="px-8 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {previousAssessment && (
                  <Tooltip
                    content={
                      <div className="flex items-center gap-2">
                        <KeyboardKey>←</KeyboardKey>
                        <span>Previous candidate</span>
                      </div>
                    }
                    position="top"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSave();
                        onNavigate(previousAssessment);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </motion.button>
                  </Tooltip>
                )}
              </div>

              {/* Position Indicator */}
              <div className="text-sm text-gray-500">
                {currentIndex + 1} of {assessments.length}
              </div>

              <div className="flex items-center gap-2">
                {nextAssessment && (
                  <Tooltip
                    content={
                      <div className="flex items-center gap-2">
                        <span>Next candidate</span>
                        <KeyboardKey>→</KeyboardKey>
                      </div>
                    }
                    position="top"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSave();
                        onNavigate(nextAssessment);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </Tooltip>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}