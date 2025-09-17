"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the question type
export interface Question {
  id: number;
  text: string;
  options: {
    id: number;
    text: string;
    value: number;
  }[];
}

// Define initial questions based on the new content
const questions: Question[] = [
  {
    id: 1,
    text: "How often do you help those in need?",
    options: [
      { id: 1, text: "Whenever I can, it's a priority", value: 10 },
      { id: 2, text: "Often, if it's convenient", value: 7 },
      { id: 3, text: "Sometimes, when asked directly", value: 5 },
      { id: 4, text: "Rarely, I have my own problems", value: 2 },
      { id: 5, text: "Never, everyone should help themselves", value: 0 },
    ],
  },
  {
    id: 2,
    text: "How do you respond when someone wrongs you?",
    options: [
      {
        id: 1,
        text: "I forgive and try to understand their perspective",
        value: 10,
      },
      { id: 2, text: "I forgive but keep my distance", value: 7 },
      { id: 3, text: "I don't forgive but I don't seek revenge", value: 5 },
      { id: 4, text: "I hold grudges for a long time", value: 2 },
      { id: 5, text: "I always find a way to get even", value: 0 },
    ],
  },
  {
    id: 3,
    text: "How honest are you in your daily life?",
    options: [
      { id: 1, text: "I'm always honest, even when it's difficult", value: 10 },
      {
        id: 2,
        text: "I'm honest in important matters, but might tell white lies",
        value: 7,
      },
      {
        id: 3,
        text: "I'm honest with friends and family, but not always with others",
        value: 5,
      },
      { id: 4, text: "I lie when it benefits me", value: 2 },
      {
        id: 5,
        text: "I believe truth is subjective and act accordingly",
        value: 0,
      },
    ],
  },
  {
    id: 4,
    text: "How do you treat animals?",
    options: [
      { id: 1, text: "With great care and respect", value: 10 },
      {
        id: 2,
        text: "Well, though I'm not particularly passionate about them",
        value: 7,
      },
      { id: 3, text: "I'm indifferent to most animals", value: 5 },
      { id: 4, text: "I don't really care about their wellbeing", value: 2 },
      {
        id: 5,
        text: "I find harming animals entertaining sometimes",
        value: 0,
      },
    ],
  },
  {
    id: 5,
    text: "When you have power over others, how do you use it?",
    options: [
      { id: 1, text: "To help and uplift others", value: 10 },
      { id: 2, text: "Fairly, with everyone's interests in mind", value: 7 },
      { id: 3, text: "To maintain order, even if some are unhappy", value: 5 },
      { id: 4, text: "To benefit myself and those I care about", value: 2 },
      { id: 5, text: "To control others and get what I want", value: 0 },
    ],
  },
];

// Define user info interface
interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

// Define context type
interface QuestionnaireContextType {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, number>;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  currentStep: "welcome" | "question" | "payment" | "result";
  setCurrentStep: (step: "welcome" | "question" | "payment" | "result") => void;
  calculateScore: () => number;
  resetQuestionnaire: () => void;
  // New admin functions
  addQuestion: (question: Omit<Question, "id">) => void;
  updateQuestion: (id: number, question: Omit<Question, "id">) => void;
  deleteQuestion: (id: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setQuestions: (questions: Question[]) => void;
}

// Create context with default values
const QuestionnaireContext = createContext<QuestionnaireContextType>({
  questions,
  currentQuestionIndex: 0,
  answers: {},
  userInfo: {
    name: "",
    email: "",
    phone: "",
  },
  setUserInfo: () => {},
  setAnswer: () => {},
  nextQuestion: () => {},
  previousQuestion: () => {},
  currentStep: "welcome",
  setCurrentStep: () => {},
  calculateScore: () => 0,
  resetQuestionnaire: () => {},
  addQuestion: () => {},
  updateQuestion: () => {},
  deleteQuestion: () => {},
  reorderQuestions: () => {},
  setQuestions: () => {},
});

// Hook for using context
export const useQuestionnaire = () => useContext(QuestionnaireContext);

// Provider component
export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionsState, setQuestionsState] = useState<Question[]>(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "question" | "payment" | "result"
  >("welcome");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
  });

  const setAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsState.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep("payment");
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentStep("welcome");
    }
  };

  const calculateScore = () => {
    const totalPossibleScore = questionsState.length * 10;
    const userScore = Object.values(answers).reduce(
      (acc, curr) => acc + curr,
      0
    );
    return (userScore / totalPossibleScore) * 100;
  };

  const resetQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentStep("welcome");
    setUserInfo({
      name: "",
      email: "",
      phone: "",
    });
  };

  // Admin functions
  const addQuestion = (question: Omit<Question, "id">) => {
    const newId = Math.max(...questionsState.map((q) => q.id)) + 1;
    const newQuestion = { ...question, id: newId };
    setQuestionsState([...questionsState, newQuestion]);
  };

  const updateQuestion = (id: number, question: Omit<Question, "id">) => {
    setQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...question, id } : q))
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestionsState((prev) => prev.filter((q) => q.id !== id));
  };

  const reorderQuestions = (fromIndex: number, toIndex: number) => {
    setQuestionsState((prev) => {
      const newQuestions = [...prev];
      const [removed] = newQuestions.splice(fromIndex, 1);
      newQuestions.splice(toIndex, 0, removed);
      return newQuestions;
    });
  };

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        questions: questionsState,
        currentQuestionIndex,
        answers,
        userInfo,
        setUserInfo,
        setAnswer,
        nextQuestion,
        previousQuestion,
        currentStep,
        setCurrentStep,
        calculateScore,
        resetQuestionnaire,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        setQuestions,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};
