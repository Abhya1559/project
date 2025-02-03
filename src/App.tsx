import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizCard } from './components/QuizCard';
import { QuizSummary } from './components/QuizSummary';
import { LandingPage } from './components/LandingPage';
import { QuizQuestion, QuizState } from './types/quiz';
import { Brain } from 'lucide-react';

const QUESTION_TIMER = 30; // seconds per question

// Sample fallback data in case the API fails
const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    points: 10
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    points: 10
  },
  {
    id: "3",
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    points: 10
  }
];

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    isComplete: false,
    streak: 0,
    timeSpent: 0,
  });
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (quizStarted && !quizState.isComplete && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswerSubmit('');
            return QUESTION_TIMER;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.currentQuestionIndex, quizState.isComplete, questions.length, quizStarted]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch('https://api.jsonserve.com/Uw5CrX', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.warn('API did not return an array, using fallback data');
        setQuestions(FALLBACK_QUESTIONS);
        setLoading(false);
        return;
      }

      // Transform and validate the data
      const transformedData = data.map((q: any) => {
        if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) {
          throw new Error('Invalid question format in API response');
        }
        return {
          id: (q.id || Math.random().toString(36).substr(2, 9)).toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 10,
        };
      });
      
      setQuestions(transformedData);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      console.log('Using fallback questions due to API error');
      setQuestions(FALLBACK_QUESTIONS);
      setError(null);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = (answer: string) => {
    if (!questions.length) return;
    
    const currentQuestion = questions[quizState.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = answer === currentQuestion.correctAnswer;

    setQuizState((prev) => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      setMaxStreak(Math.max(maxStreak, newStreak));

      const newState = {
        ...prev,
        score: isCorrect ? prev.score + (currentQuestion.points || 10) : prev.score,
        answers: { ...prev.answers, [currentQuestion.id]: answer },
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        isComplete: prev.currentQuestionIndex === questions.length - 1,
        streak: newStreak,
        timeSpent: prev.timeSpent + (QUESTION_TIMER - timeLeft),
      };

      return newState;
    });

    setTimeLeft(QUESTION_TIMER);
  };

  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      isComplete: false,
      streak: 0,
      timeSpent: 0,
    });
    setTimeLeft(QUESTION_TIMER);
    setMaxStreak(0);
    setQuizStarted(false);
    fetchQuizData(); // Fetch fresh questions when restarting
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button
            onClick={fetchQuizData}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">No questions available</p>
          <button
            onClick={fetchQuizData}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reload Questions
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return <LandingPage onStartQuiz={() => setQuizStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Knowledge Quest</h1>
          <p className="text-gray-600">Test your knowledge and earn points!</p>
        </div>

        <AnimatePresence mode="wait">
          {!quizState.isComplete ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <QuizCard
                question={questions[quizState.currentQuestionIndex]}
                selectedAnswer={quizState.answers[questions[quizState.currentQuestionIndex].id] || null}
                onAnswerSelect={handleAnswerSubmit}
                streak={quizState.streak}
                timeLeft={timeLeft}
              />
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <QuizSummary
                score={quizState.score}
                totalQuestions={questions.length}
                timeSpent={quizState.timeSpent}
                maxStreak={maxStreak}
                onRestart={restartQuiz}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;