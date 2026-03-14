"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const QuizPreview = () => {
  const currentQuestion = 3;
  const totalQuestions = 10;
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  // Example question and answers with single quotes
  const question =
    "You find a wallet with $500 and ID. What would you do if it's yours?";
  const answers = [
    "Return it to the owner without taking any money",
    "Take a small 'finder's fee' before returning it",
    "Keep the money, discard the wallet",
    "Turn it in to the police",
  ];

  return (
    <section id="quiz-preview" className="bg-background-primary py-20">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-background-accent rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Star className="text-highlight-text" size={20} />
              <span className="font-bold text-button-text">
                The Future of Man
              </span>
            </div>
            <span className="text-sm text-tertiary-text">
              Question {currentQuestion} of {totalQuestions}
            </span>
          </div>
          <div className="mb-8">
            <div className="w-full bg-tertiary-text rounded-full h-2.5 mb-6">
              <div
                className="bg-background-button h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>
            <h3 className="text-2xl font-bold text-secondary-text mb-6">
              {question}
            </h3>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-4 border border-tertiary-text rounded-xl cursor-pointer  hover:bg-tertiary-text"
                >
                  <input type="radio" name="answer" className="w-4 h-4" />
                  <span className="text-secondary-text">{answer}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-tertiary-text  hover:bg-secondary-text">
              <ArrowLeft size={16} />
              Previous
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-background-tertiary hover:bg-background-secondary">
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { QuizPreview };
