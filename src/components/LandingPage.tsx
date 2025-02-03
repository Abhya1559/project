import React from "react";
import { motion } from "framer-motion";
import { Brain, Award, Clock, Zap, ChevronRight, Star } from "lucide-react";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-900 text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="inline-block p-5 bg-white bg-opacity-25 backdrop-blur-xl rounded-full shadow-2xl">
          <Brain className="w-20 h-20 text-yellow-400 animate-pulse" />
        </div>
        <h1 className="text-6xl font-extrabold mt-6 drop-shadow-xl tracking-wide">
          Knowledge Quest
        </h1>
        <p className="text-lg mt-4 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Dive into the ultimate knowledge challenge! Test your skills, build
          streaks, and rise to the top of the leaderboard.
        </p>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartQuiz}
          className="mt-8 bg-yellow-400 text-gray-900 px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-yellow-500 transition-all transform hover:shadow-2xl"
        >
          Start Quiz <ChevronRight className="inline-block ml-2 w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-16 max-w-6xl w-full px-6"
      >
        {[
          {
            title: "Timed Questions",
            icon: <Clock className="w-12 h-12 text-blue-400" />,
            desc: "Race against time and earn bonus points for quick answers.",
          },
          {
            title: "Streak System",
            icon: <Zap className="w-12 h-12 text-yellow-400" />,
            desc: "Answer consecutive questions correctly for extra rewards.",
          },
          {
            title: "Leaderboard",
            icon: <Award className="w-12 h-12 text-green-400" />,
            desc: "Compete for the highest score and claim the top spot!",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-xl shadow-xl text-center transform transition-transform"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-white tracking-wider">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-md">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
