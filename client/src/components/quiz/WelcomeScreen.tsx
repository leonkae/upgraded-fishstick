"use client";

import React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useQuestionnaire } from "@/components/quiz/QuestionnaireContext";

const WelcomeScreen: React.FC = () => {
  const { setCurrentStep } = useQuestionnaire();

  return (
    <div className="min-h-screen purple-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
          <span className="font-medium text-purple-700">The Future of Man</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-serif">
          Discover Your Path
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          Answer a few questions to discover your eternal destination. Will you
          ascend to the heavenly gates or descend into fiery depths?
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-purple-700 hover:bg-purple-800 text-white font-medium text-lg px-8 py-3 rounded-full"
            onClick={() => setCurrentStep("question")}
          >
            Begin Your Journey
          </Button>
        </motion.div>

        <p className="mt-6 text-gray-500 italic">
          Will you find redemption or damnation?
        </p>
      </motion.div>
    </div>
  );
};

export { WelcomeScreen };
