import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, User, Briefcase, Link as LinkIcon, Linkedin, Github, Globe, Code,
  ChevronLeft, ChevronRight, Save, Minus, Plus, HelpCircle, Calendar
} from 'lucide-react';
import { Assessment, SeniorityLevel, AudioNote, Competency, LevelScore, QuestionWithRationale } from '../types';
import { RUBRIC } from '../config/rubric';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { formatDate, getRelativeTime } from '../utils/dateUtils';
import AudioNoteRecorder from './AudioNoteRecorder';
import Tooltip from './Tooltip';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { KeyboardKey } from './KeyboardKey';

interface NewAssessmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    candidateName: string;
    role?: string;
    links?: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
      codepen?: string;
    };
  }) => Assessment;
  onSave: (assessment: Assessment) => void;
}

// Common skills that can be suggested
const SUGGESTED_SKILLS = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", "Go", "Rust",
  "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Redis", "GraphQL",
  "REST API", "Microservices", "CI/CD", "Git", "Vue.js", "Angular", "Next.js",
  "Express", "Django", "Flask", "Leadership", "Mentoring", "Agile", "Testing",
  "Security", "HTML", "CSS", "Tailwind", "Figma", "UX", "UI/UX", "SQL", "NoSQL",
  "Machine Learning", "AI", "Data Science", "Mobile", "iOS", "Android",
  "React Native", "Flutter",
];

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
  const strokeDashoffset = circumference - (score / 100) * circumference;

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
        <motion.circle
          stroke={met ? style.strokeColor : "#9ca3af"}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5 }}
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

export default function NewAssessmentDrawer({ isOpen, onClose, onSubmit, onSave }: NewAssessmentDrawerProps) {
  const [step, setStep] = useState<'initial' | 'assessment'>('initial');
  
  // Initial form state
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [codepen, setCodepen] = useState('');
  
  // Assessment state
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SeniorityLevel>("senior");
  const [scores, setScores] = useState({ junior: {}, mid: {}, senior: {} });
  const [notes, setNotes] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [audioNotes, setAudioNotes] = useState<AudioNote[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedCompetencies, setExpandedCompetencies] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.values(RUBRIC).forEach((rubric) => {
      rubric.competencies.forEach((comp) => {
        initial[comp.id] = true;
      });
    });
    return initial;
  });

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const handleStartAssessment = () => {
    if (candidateName.trim()) {
      const links: any = {};
      if (linkedin.trim()) links.linkedin = linkedin.trim();
      if (github.trim()) links.github = github.trim();
      if (portfolio.trim()) links.portfolio = portfolio.trim();
      if (codepen.trim()) links.codepen = codepen.trim();

      const newAssessment = onSubmit({
        candidateName: candidateName.trim(),
        role: role.trim() || undefined,
        links: Object.keys(links).length > 0 ? links : undefined
      });

      // Safety check - ensure assessment was created
      if (!newAssessment) {
        console.error('Failed to create assessment');
        return;
      }

      setCurrentAssessment(newAssessment);
      setScores(newAssessment.scores || { junior: {}, mid: {}, senior: {} });
      setNotes(newAssessment.notes || '');
      setSkills(newAssessment.skills || []);
      setAudioNotes(newAssessment.audioNotes || []);
      setHasChanges(false);
      
      // Set default selected level
      const calculateScore = (level: SeniorityLevel) => {
        const rubric = RUBRIC[level];
        const totalPossible = rubric.competencies.reduce((sum, comp) => sum + comp.maxScore, 0);
        const levelScores = newAssessment.scores?.[level] || {};
        const totalCurrent = rubric.competencies.reduce((sum, comp) => {
          const score = levelScores[comp.id] || 0;
          return sum + score;
        }, 0);
        return totalPossible > 0 ? Math.round((totalCurrent / totalPossible) * 100) : 0;
      };

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
        setSelectedLevel("mid");
      }
      
      // INSTANT swap - no animation
      setStep('assessment');
    }
  };

  const handleSave = () => {
    if (!currentAssessment) return;
    const updatedAssessment: Assessment = {
      ...currentAssessment,
      scores,
      notes,
      skills,
      audioNotes,
    };
    onSave(updatedAssessment);
    setHasChanges(false);
  };

  const handleReset = () => {
    // Auto-save before closing if there are changes
    if (hasChanges && currentAssessment) {
      const updatedAssessment: Assessment = {
        ...currentAssessment,
        scores,
        notes,
        skills,
        audioNotes,
      };
      onSave(updatedAssessment);
    }
    
    setCandidateName('');
    setRole('');
    setLinkedin('');
    setGithub('');
    setPortfolio('');
    setCodepen('');
    setCurrentAssessment(null);
    setScores({ junior: {}, mid: {}, senior: {} });
    setNotes('');
    setSkills([]);
    setAudioNotes([]);
    setHasChanges(false);
    setStep('initial');
    onClose();
  };

  // Calculate level score
  const calculateLevelScore = (level: SeniorityLevel): number => {
    const rubric = RUBRIC[level];
    const totalPossible = rubric.competencies.reduce((sum, comp) => sum + comp.maxScore, 0);
    const totalCurrent = rubric.competencies.reduce((sum, comp) => {
      const score = scores[level][comp.id] || 0;
      return sum + score;
    }, 0);
    return totalPossible > 0 ? Math.round((totalCurrent / totalPossible) * 100) : 0;
  };

  // Calculate all level scores
  const levelScores: LevelScore[] = useMemo(() => {
    if (!currentAssessment) return [];
    return (["junior", "mid", "senior"] as SeniorityLevel[]).map((level) => {
      const score = calculateLevelScore(level);
      const threshold = RUBRIC[level].threshold;
      return {
        level,
        score,
        threshold,
        met: score >= threshold,
      };
    });
  }, [scores, currentAssessment]);

  // Determine overall status
  const overallStatus = useMemo(() => {
    if (!currentAssessment || levelScores.length === 0)
      return { text: "", level: null };
    if (levelScores[2].met)
      return { text: "Meets Senior threshold", level: "senior" as SeniorityLevel };
    if (levelScores[1].met)
      return { text: "Meets Mid threshold", level: "mid" as SeniorityLevel };
    if (levelScores[0].met)
      return { text: "Meets Junior threshold", level: "junior" as SeniorityLevel };
    return { text: "Below all thresholds – no clear level yet", level: null };
  }, [levelScores, currentAssessment]);

  // Update score
  const updateScore = (competencyId: string, delta: number) => {
    const competency = RUBRIC[selectedLevel].competencies.find((c) => c.id === competencyId);
    if (!competency) return;

    const currentScore = scores[selectedLevel][competencyId] || 0;
    const newScore = Math.max(0, Math.min(competency.maxScore, currentScore + delta));

    setScores((prev) => ({
      ...prev,
      [selectedLevel]: {
        ...prev[selectedLevel],
        [competencyId]: newScore,
      },
    }));
    setHasChanges(true);
  };

  // Get competency score
  const getCompetencyScore = (competencyId: string): number => {
    return scores[selectedLevel][competencyId] || 0;
  };

  // Get competency progress
  const getCompetencyProgress = (competency: Competency): number => {
    const score = getCompetencyScore(competency.id);
    return (score / competency.maxScore) * 100;
  };

  // Toggle competency expanded
  const toggleCompetency = (competencyId: string) => {
    setExpandedCompetencies((prev) => ({
      ...prev,
      [competencyId]: !prev[competencyId],
    }));
  };

  // Add skill
  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
      setShowSkillSuggestions(false);
      setHasChanges(true);
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
    setHasChanges(true);
  };

  // Add audio note
  const handleAddAudioNote = (note: AudioNote) => {
    setAudioNotes([...audioNotes, note]);
    setHasChanges(true);
  };

  // Delete audio note
  const handleDeleteAudioNote = (id: string) => {
    setAudioNotes(audioNotes.filter((n) => n.id !== id));
    setHasChanges(true);
  };

  // Filter skill suggestions
  const filteredSkillSuggestions = SUGGESTED_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !skills.includes(skill)
  ).slice(0, 8);

  const currentRubric = RUBRIC[selectedLevel];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleReset}
      />

      {/* Single Drawer - Both views rendered, visibility toggled */}
      <div className="fixed right-0 top-0 h-full w-[60%] bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        
        {/* INITIAL FORM VIEW */}
        <div style={{ display: step === 'initial' ? 'contents' : 'none' }}>
          {/* Header */}
          <div className="px-[32px] py-[24px] border-b border-gray-200 bg-white pt-[16px] pr-[32px] pb-[16px] pl-[32px]">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">New Assessment</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleReset}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Candidate Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g. Sarah Chen"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleStartAssessment()}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Role (optional)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Full-Stack Developer"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all"
                          onKeyPress={(e) => e.key === 'Enter' && handleStartAssessment()}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-gray-900">Social Links (optional)</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-[#0077B5]" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/sarahchen"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Github className="w-4 h-4 text-gray-900" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        placeholder="https://github.com/sarahchen"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#0061FF]" />
                        Portfolio
                      </label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://sarahchen.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4 text-gray-900" />
                        CodePen
                      </label>
                      <input
                        type="url"
                        value={codepen}
                        onChange={(e) => setCodepen(e.target.value)}
                        placeholder="https://codepen.io/sarahchen"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> You can always add more details like skills and notes after creating the assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAssessment}
              disabled={!candidateName.trim()}
              className={`px-6 py-2.5 rounded-lg transition-colors text-sm ${
                candidateName.trim()
                  ? 'bg-[#0061FF] hover:bg-[#0052D6] text-white shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Assessment
            </motion.button>
          </div>
        </div>

        {/* ASSESSMENT VIEW */}
        <div style={{ display: step === 'assessment' ? 'contents' : 'none' }}>
          {currentAssessment && (
            <>
              {/* Assessment Header */}
              <div className="px-[32px] py-[24px] border-b border-gray-200 bg-white pt-[16px] pr-[32px] pb-[0px] pl-[32px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {currentAssessment.avatarUrl && (
                      <ImageWithFallback
                        src={currentAssessment.avatarUrl}
                        alt={currentAssessment.candidateName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <h2 className="text-gray-900">{currentAssessment.candidateName}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        {currentAssessment.role && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            {currentAssessment.role}
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {getRelativeTime(currentAssessment.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={!hasChanges}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm ${
                        hasChanges
                          ? 'bg-[#0061FF] text-white shadow-sm hover:bg-[#0052D6]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      {hasChanges ? 'Save Changes' : 'Saved'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleReset}
                      className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </motion.button>
                  </div>
                </div>

                {/* Social Links */}
                {currentAssessment.links && Object.keys(currentAssessment.links).length > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    {currentAssessment.links.linkedin && (
                      <a
                        href={currentAssessment.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B5]/10 text-[#0077B5] rounded-lg hover:bg-[#0077B5]/20 transition-colors text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {currentAssessment.links.github && (
                      <a
                        href={currentAssessment.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/10 text-gray-900 rounded-lg hover:bg-gray-900/20 transition-colors text-sm"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {currentAssessment.links.portfolio && (
                      <a
                        href={currentAssessment.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0061FF]/10 text-[#0061FF] rounded-lg hover:bg-[#0061FF]/20 transition-colors text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                    {currentAssessment.links.codepen && (
                      <a
                        href={currentAssessment.links.codepen}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/10 text-gray-900 rounded-lg hover:bg-gray-900/20 transition-colors text-sm"
                      >
                        <Code className="w-4 h-4" />
                        CodePen
                      </a>
                    )}
                  </div>
                )}

                {/* Overall Status Badge */}
                <div className="flex items-center gap-3 pb-6">
                  <div
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: overallStatus.level
                        ? `var(--level-${overallStatus.level}-bg)`
                        : "#f3f4f6",
                      color: overallStatus.level
                        ? `var(--level-${overallStatus.level}-dark)`
                        : "#6b7280",
                    }}
                  >
                    {overallStatus.text}
                  </div>
                </div>
              </div>

              {/* Assessment Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex gap-6 p-8">
                  {/* Left Column: Questions */}
                  <div className="flex-1 space-y-6">
                    {/* Level Tabs - Sticky */}
                    <div className="sticky top-0 z-10 bg-[#F7F9FC] pb-6">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-3">
                          {(["junior", "mid", "senior"] as SeniorityLevel[]).map((level, index) => {
                            const levelScore = levelScores[index];
                            const isSelected = selectedLevel === level;
                            const isMet = levelScore.met;

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
                                onClick={() => setSelectedLevel(level)}
                                className="px-6 py-5 flex flex-col items-center gap-3 transition-all border-b-2"
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
                                <div className="flex items-center gap-2">
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

                    {/* Competencies - Simplified version for brevity */}
                    <div className="space-y-4">
                      {currentRubric.competencies.map((competency, index) => {
                        const score = getCompetencyScore(competency.id);
                        const progress = getCompetencyProgress(competency);
                        const expanded = expandedCompetencies[competency.id] || false;

                        return (
                          <div
                            key={competency.id}
                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                          >
                            <div className="space-y-4">
                              {/* Competency Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <h3 className="text-gray-900">{competency.label}</h3>
                                  <Tooltip
                                    content={
                                      <div>
                                        {competency.id === "technical_depth" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>What it measures:</strong> The candidate's depth of technical knowledge, architectural understanding, and ability to work with complex systems.
                                            </div>
                                            <div className="mb-2">
                                              <strong>Why it matters:</strong> Deeper technical knowledge means fewer blockers, better design decisions, and ability to mentor others.
                                            </div>
                                            <div>
                                              <strong>Red flags:</strong> Surface-level answers, inability to explain trade-offs, or only knowing one way to solve problems.
                                            </div>
                                          </>
                                        )}
                                        {competency.id === "problem_solving" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>What it measures:</strong> How candidates approach unfamiliar challenges, break down complex problems, and think through solutions systematically.
                                            </div>
                                            <div className="mb-2">
                                              <strong>Why it matters:</strong> Developers spend most of their time solving problems, not writing code.
                                            </div>
                                            <div>
                                              <strong>Red flags:</strong> Giving up easily, needing excessive guidance, or only solving problems they've seen before.
                                            </div>
                                          </>
                                        )}
                                        {competency.id === "autonomy" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>What it measures:</strong> How independently candidates can work, from understanding requirements to delivering solutions.
                                            </div>
                                            <div className="mb-2">
                                              <strong>Why it matters:</strong> Autonomous developers are force multipliers who free up senior team members and ship features faster.
                                            </div>
                                            <div>
                                              <strong>Red flags:</strong> Constant need for approval, inability to make decisions, or waiting for others to unblock them.
                                            </div>
                                          </>
                                        )}
                                        {competency.id === "communication" && (
                                          <>
                                            <div className="mb-2">
                                              <strong>What it measures:</strong> How clearly candidates explain technical concepts, document work, and collaborate with teammates.
                                            </div>
                                            <div className="mb-2">
                                              <strong>Why it matters:</strong> Poor communication causes misunderstandings, delays, and technical debt. Great communicators make everyone more productive.
                                            </div>
                                            <div>
                                              <strong>Red flags:</strong> Overly technical jargon, inability to simplify concepts, or defensive reactions to questions.
                                            </div>
                                          </>
                                        )}
                                        {!["technical_depth", "problem_solving", "autonomy", "communication"].includes(competency.id) && (
                                          <>
                                            <div className="mb-2">
                                              <strong>What it measures:</strong> This competency evaluates specific skills and behaviors that indicate the candidate's fit for the role.
                                            </div>
                                            <div className="mb-2">
                                              <strong>Why it matters:</strong> Each competency reflects real-world job requirements and helps you make data-driven hiring decisions.
                                            </div>
                                            <div>
                                              <strong>Red flags:</strong> Look for inconsistencies in their answers, lack of specific examples, or inability to demonstrate practical application of their claimed skills.
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
                                        setExpandedCompetencies({
                                          ...expandedCompetencies,
                                          [competency.id]: !expanded,
                                        })
                                      }
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                      <HelpCircle className="w-4 h-4" />
                                    </button>
                                  </Tooltip>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">
                                    {score} / {competency.maxScore}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateScore(competency.id, -1)}
                                      disabled={score === 0}
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                        score === 0
                                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                      }`}
                                    >
                                      <Minus className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => updateScore(competency.id, 1)}
                                      disabled={score >= competency.maxScore}
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                        score >= competency.maxScore
                                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                          : "bg-[#0061FF] hover:bg-[#0052D6] text-white"
                                      }`}
                                    >
                                      <Plus className="w-5 h-5" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className="bg-[#0061FF] h-2 rounded-full transition-all"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                />
                              </div>

                              {/* Sample Questions */}
                              {expanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="pt-4 border-t border-gray-200"
                                >
                                  <div className="text-sm text-gray-600 mb-3">
                                    Sample questions to ask:
                                  </div>
                                  <ul className="space-y-2">
                                    {competency.sampleQuestions.map((item, idx) => {
                                      const questionText = typeof item === "string" ? item : item.question;
                                      const rationale = typeof item === "string" ? null : item.rationale;

                                      return (
                                        <motion.li
                                          key={idx}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: idx * 0.05 }}
                                          className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg"
                                        >
                                          <span className="text-[#0061FF] font-medium flex-shrink-0">
                                            {idx + 1}.
                                          </span>
                                          <span className="flex-1">{questionText}</span>
                                          {rationale && (
                                            <div className="relative group flex-shrink-0">
                                              <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#0061FF] transition-colors" />
                                              <div className="absolute right-0 top-6 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                                                <div className="mb-1.5 text-[#60A5FA]">Why ask this?</div>
                                                <div className="leading-relaxed">{rationale}</div>
                                                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                              </div>
                                            </div>
                                          )}
                                        </motion.li>
                                      );
                                    })}
                                  </ul>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Notes placeholder */}
                  <div className="w-80 space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-gray-900 mb-4">Notes</h3>
                      <textarea
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          setHasChanges(true);
                        }}
                        placeholder="Add notes about this candidate..."
                        className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0061FF] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 border-t border-gray-200 bg-white flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Press <KeyboardKey>Esc</KeyboardKey> to close
                </div>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`px-6 py-2.5 rounded-lg transition-colors text-sm ${
                    hasChanges
                      ? 'bg-[#0061FF] hover:bg-[#0052D6] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}