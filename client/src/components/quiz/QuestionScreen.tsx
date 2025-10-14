"use client";

import React, { useState, useEffect } from "react";
import { useQuestionnaire } from "./QuestionnaireContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const QuestionScreen: React.FC = () => {
  const {
    questions,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    previousQuestion,
  } = useQuestionnaire();

  const currentQuestion = questions[currentQuestionIndex];

  // ✅ Hooks declared at the top, no conditionals
  const [selectedOption, setSelectedOption] = useState<string>(
    currentQuestion && answers[currentQuestion.id] !== undefined
      ? answers[currentQuestion.id].toString()
      : ""
  );
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    if (currentQuestion) {
      setSelectedOption(
        answers[currentQuestion.id] !== undefined
          ? answers[currentQuestion.id].toString()
          : ""
      );
    }
  }, [currentQuestion, answers]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    setAnswer(currentQuestion.id, parseInt(value));
  };

  const handleNext = () => {
    setDirection("next");
    nextQuestion();
  };

  const handlePrevious = () => {
    setDirection("prev");
    previousQuestion();
  };

  // Calculate progress percentage
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  // ✅ Early return AFTER hooks
  if (!currentQuestion) {
    return (
      <div className="min-h-screen purple-gradient flex items-center justify-center p-6">
        <p className="text-white text-lg">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen purple-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{
              x: direction === "next" ? 100 : -100,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x: direction === "next" ? -100 : 100,
              opacity: 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-xs">⚡</span>
                </div>
                <span className="font-medium text-purple-700">
                  The Future of Man
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full mb-8">
              <div className="progress-bar bg-gray-200">
                <div
                  className="progress-fill bg-purple-600"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold mb-8 text-gray-900 font-serif">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <RadioGroup
              value={selectedOption}
              onValueChange={handleOptionSelect}
              className="space-y-4 mb-8"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.id}`}
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex-1 cursor-pointer text-gray-700"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                className="flex items-center gap-2 text-gray-600"
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-6 w-fit"
                disabled={selectedOption === ""}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}{" "}
                <ChevronRight size={16} />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export { QuestionScreen };
