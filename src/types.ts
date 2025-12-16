// Core types for The Recruitment Thing v1

export interface QuestionWithRationale {
  question: string;
  rationale: string;
}

export interface Competency {
  id: string;
  label: string;
  maxScore: number;
  currentScore: number;
  sampleQuestions: string[] | QuestionWithRationale[];
}

export interface LevelRubric {
  threshold: number;
  competencies: Competency[];
}

export interface Rubric {
  junior: LevelRubric;
  mid: LevelRubric;
  senior: LevelRubric;
}

export interface Assessment {
  id: string;
  candidateName: string;
  role?: string;
  date: string;
  notes: string;
  audioNotes?: AudioNote[];
  avatarUrl?: string;
  skills?: string[];
  tags?: string[]; // Custom tags for grouping/searching (e.g., "good social skills", "team player")
  links?: {
    linkedin?: string;
    portfolio?: string;
    codepen?: string;
    github?: string;
  };
  scores: {
    junior: Record<string, number>; // competencyId -> score
    mid: Record<string, number>;
    senior: Record<string, number>;
  };
}

export interface AudioNote {
  id: string;
  timestamp: string;
  duration: number; // in seconds
  transcript?: string;
  url?: string; // Will be added when actual recording is implemented
}

export type SeniorityLevel = 'junior' | 'mid' | 'senior';

export interface LevelScore {
  level: SeniorityLevel;
  score: number; // 0-100
  threshold: number;
  met: boolean;
}