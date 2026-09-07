export type LanguageId =
  | 'python'
  | 'javascript'
  | 'java'
  | 'cpp'
  | 'c'
  | 'typescript'
  | 'php'
  | 'ruby'
  | 'rust'
  | 'go';

export interface LanguageInfo {
  id: LanguageId;
  name: string;
  icon: string; // emoji or identifier
  color: string;
  bgLight: string;
  borderColor: string;
  tagline: string;
  description: string;
  popularConcepts: string[];
}

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'adaptive';

export type QuestionType =
  | 'output_prediction'
  | 'find_bug'
  | 'code_completion'
  | 'what_will_happen'
  | 'which_statement'
  | 'time_space_complexity'
  | 'code_comparison'
  | 'debugging'
  | 'concept_based'
  | 'syntax_challenge'
  | 'code_ordering'
  | 'true_false'
  | 'scenario_based'
  | 'mcq';

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  codeSnippet?: string;
}

export interface Question {
  question_id: string;
  language: LanguageId;
  topic: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  question_type: QuestionType;
  question_hash: string;
  concept_id: string;
  concept_name: string;
  variation_id: string;
  times_used: number;
  prompt: string;
  code?: string;
  code_language?: string;
  options: QuestionOption[];
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  common_mistake: string;
  remember_this: string;
  tags?: string[];
  source?: 'built_in' | 'dynamic_variation' | 'ai_generated';
  specific_explanation?: string;
}

export interface QuestionTemplate {
  id?: string;
  concept_id: string;
  concept_name: string;
  language: LanguageId;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  topic: string;
  base_explanation: string;
  common_mistake: string;
  remember_this: string;
  variations: Array<{
    variation_id: string;
    question_type: QuestionType;
    prompt: string;
    code?: string;
    options: QuestionOption[];
    correct_answer: 'A' | 'B' | 'C' | 'D';
    specific_explanation?: string;
  }>;
}

export interface QuizSession {
  id: string;
  userId?: string;
  mode: 'single' | 'mixed' | 'adaptive';
  languages: LanguageId[];
  selectedLanguages?: LanguageId[];
  difficulty: DifficultyLevel;
  difficultySetting?: DifficultyLevel;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  timeRemainingSeconds?: number;
  timeSpentSeconds?: number;
  isCompleted?: boolean;
  adaptiveLevel?: 'basic' | 'intermediate' | 'advanced';
  streakCount?: number;
  startedAt?: number;
  adaptiveStreak?: number;
  currentAdaptiveDifficulty?: 'basic' | 'intermediate' | 'advanced';
}

export interface QuizResult {
  id?: string;
  sessionId?: string;
  timestamp?: number;
  completedAt?: number;
  mode?: string;
  languages: LanguageId[];
  difficulty: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
}

export interface UserStats {
  codingLevelPercent: number;
  dayStreak: number;
  totalQuizzes: number;
  questionsSolved: number;
  accuracy: number;
  bestScore: number;
  languageStats?: Record<
    string,
    {
      solved: number;
      correct: number;
      accuracy: number;
    }
  >;
  languageMastery?: Record<string, number>;
  answeredQuestionHashes?: string[];
  recentSessions?: QuizResult[];
  recentResults?: QuizResult[];
  unlockedBadges?: string[];
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'special';
  unlocked: boolean;
  progress?: { current: number; max: number };
}
