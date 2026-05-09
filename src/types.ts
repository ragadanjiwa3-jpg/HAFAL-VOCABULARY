export interface Word {
  id: string;
  term: string;
  phonetic: string;
  definition: string;
  translation: string;
  partOfSpeech: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  example: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'matching';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MatchingPair {
  word: string;
  definition: string;
}

export interface UserStats {
  streak: number;
  wordsMastered: number;
  totalXp: number;
  dailyProgress: number; // 0 to 100
}
