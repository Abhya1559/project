import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QuizQuestion } from "../types/quiz";
import { Trophy, Timer, Zap, CheckCircle, AlertTriangle } from "lucide-react";

interface QuizCardProps {
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  streak: number;
  timeLeft: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  selectedAnswer,
  onAnswerSelect,
  streak,
  timeLeft,
}) => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://api.jsonserve.com/Uw5CrX", {
        mode: "no-cors",
      });
      // The response will be opaque and you won't be able to access its body content
      console.log(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  if (loading) {
    return <div className="text-gray-400 animate-pulse">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-gray-900 text-white rounded-xl shadow-lg p-8 border border-gray-800"
    >
      {/* Top Section: Streak and Timer */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-2 text-yellow-400">
          <Zap className="w-6 h-6" />
          <span className="text-lg font-semibold">Streak: {streak}</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-400">
          <Timer className="w-6 h-6" />
          <span className="text-lg font-semibold">{timeLeft}s</span>
        </div>
      </div>

      {/* Question Text */}
      <h2 className="text-2xl font-bold text-gray-100 mb-6 leading-snug">
        {question?.question}
      </h2>

      {/* Answer Options */}
      <div className="grid gap-4">
        {question?.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAnswerSelect(option)}
              className={`p-4 rounded-lg transition-all flex items-center justify-between text-lg font-medium 
                ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
            >
              {option}
              {isSelected && <CheckCircle className="w-6 h-6 text-white" />}
            </motion.button>
          );
        })}
      </div>

      {/* Points Indicator */}
      <div className="mt-6 flex items-center space-x-2 text-gray-400 text-md">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span>Points: {question?.points}</span>
      </div>
    </motion.div>
  );
};
