import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Clock, RefreshCw } from "lucide-react";

interface QuizSummaryProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  maxStreak: number;
  onRestart: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  score,
  totalQuestions,
  timeSpent,
  maxStreak,
  onRestart,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-gray-900 text-white rounded-xl shadow-lg p-8 border border-gray-800"
    >
      {/* Header */}
      <div className="text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-100 mb-2">
          Quiz Completed!
        </h2>
        <p className="text-gray-400 mb-6">Here’s how you performed</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <Star className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{percentage}%</p>
          <p className="text-sm text-gray-400">Accuracy</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <Clock className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{timeSpent}s</p>
          <p className="text-sm text-gray-400">Time Spent</p>
        </div>
      </div>

      <div className="text-center text-lg">
        <p className="mb-2">
          You scored <span className="font-bold text-blue-400">{score}</span>{" "}
          out of <span className="font-bold text-white">{totalQuestions}</span>
        </p>
        <p className="text-gray-400 mb-6">
          Max Streak:{" "}
          <span className="font-bold text-yellow-400">{maxStreak}</span>
        </p>

        {/* Restart Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold flex items-center justify-center mx-auto hover:bg-blue-600 transition-all"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> Try Again
        </motion.button>
      </div>
    </motion.div>
  );
};
