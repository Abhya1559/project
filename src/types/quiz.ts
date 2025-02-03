export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string>;
  isComplete: boolean;
  streak: number;
  timeSpent: number;
}