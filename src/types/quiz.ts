export type ParticipantType = 'Aprendiz' | 'Instructor';

export type EnglishLevel =
  | 'ENGLISH EXPLORER'
  | 'ENGLISH CHALLENGER'
  | 'ENGLISH PRO'
  | 'ENGLISH MASTER';

export type QuestionCategory = 'technical' | 'sena_general' | 'workplace';
export type QuestionType = 'es_to_en' | 'en_to_es';

export interface VocabularyItem {
  id: string;
  program: string;
  category: QuestionCategory;
  spanish: string;
  english: string;
  distractorsEn: string[]; // 3 wrong English translations
  distractorsEs: string[]; // 3 wrong Spanish translations
}

export interface QuizQuestion {
  id: string;
  program: string;
  category: QuestionCategory;
  type: QuestionType;
  prompt: string;
  subPrompt: string;
  correctAnswer: string;
  options: string[];
  originalItem: VocabularyItem;
}

export interface ParticipantData {
  id: string;
  fullName: string;
  participantType: ParticipantType;
  program: string;
  ficha?: string;
  photoUrl?: string; // Data URL or avatar URL
  createdAt: string;
}

export interface QuizResult {
  id: string;
  participantId: string;
  participantName: string;
  participantType: ParticipantType;
  program: string;
  ficha?: string;
  photoUrl?: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  totalScore: number;
  level: EnglishLevel;
  completedAt: string;
}

export interface AdminStats {
  totalParticipants: number;
  totalAprendices: number;
  totalInstructores: number;
  totalPrograms: number;
  averageScore: number;
  averageAccuracy: number;
  topProgramByParticipation: string;
  topProgramByScore: string;
  levelsCount: {
    explorer: number;
    challenger: number;
    pro: number;
    master: number;
  };
}
