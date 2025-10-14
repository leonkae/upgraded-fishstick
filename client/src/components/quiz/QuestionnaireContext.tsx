"use client";
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
} from "@/utils/localQuizStorage";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the question type
export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    value: number;
  }[];
}

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
  setCurrentQuestionIndex: (index: number) => void;
  answers: Record<string, number>;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  currentStep: "welcome" | "question" | "payment" | "result";
  setCurrentStep: (step: "welcome" | "question" | "payment" | "result") => void;
  calculateScore: () => number;
  resetQuestionnaire: () => void;
  addQuestion: (question: Omit<Question, "id">) => void;
  updateQuestion: (id: number, question: Omit<Question, "id">) => void;
  deleteQuestion: (id: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setQuestions: (questions: Question[]) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType>(
  {} as QuestionnaireContextType
);

export const useQuestionnaire = () => useContext(QuestionnaireContext);

export const QuestionnaireProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questionsState, setQuestionsState] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "question" | "payment" | "result"
  >("welcome");

  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      if (
        (saved.currentQuestionIndex && saved.currentQuestionIndex > 0) ||
        Object.keys(saved.answers || {}).length > 0
      ) {
        setCurrentStep("question");
      } else {
        setCurrentStep(saved.currentStep || "welcome");
      }
    }
  }, []);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
  });

  // 🔹 Load progress from localStorage on mount
  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      setAnswers(saved.answers || {});
      setCurrentQuestionIndex(saved.currentQuestionIndex || 0);
      setUserInfo(saved.userInfo || { name: "", email: "", phone: "" });

      // 👈 Force skip WelcomeScreen if there’s progress
      if (
        (saved.currentQuestionIndex && saved.currentQuestionIndex > 0) ||
        Object.keys(saved.answers || {}).length > 0
      ) {
        setCurrentStep("question");
      } else {
        setCurrentStep(saved.currentStep || "welcome");
      }
    }
  }, []);

  // 🔹 Persist progress whenever it changes
  useEffect(() => {
    saveQuizProgress({
      answers,
      currentQuestionIndex,
      currentStep,
      userInfo,
    });
  }, [answers, currentQuestionIndex, currentStep, userInfo]);

  // Fetch quiz questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/quiz");
        const data = await res.json();

        console.log("Fetched quiz data:", data);

        let questionsArray: any[] = [];

        if (data.success && Array.isArray(data.quiz)) {
          questionsArray = data.quiz;
        } else if (Array.isArray(data)) {
          questionsArray = data;
        } else if (data.data && Array.isArray(data.data.quiz)) {
          questionsArray = data.data.quiz;
        }

        if (questionsArray.length > 0) {
          const mapped = questionsArray.map((q: any) => ({
            id: q._id,
            text: q.text,
            options: q.options.map((opt: any) => ({
              id: opt._id,
              text: opt.label,
              value: opt.score,
            })),
          }));
          setQuestionsState(mapped);
        } else {
          console.error("No questions found in response:", data);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const setAnswer = (questionId: string, value: number) => {
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
    const totalPossibleScore = questionsState.length * 10; // assuming max value=10
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
    setUserInfo({ name: "", email: "", phone: "" });
    clearQuizProgress();
  };

  // Admin functions
  const addQuestion = (question: Omit<Question, "id">) => {
    const newId =
      questionsState.length > 0
        ? Math.max(...questionsState.map((q) => Number(q.id) || 0)) + 1
        : 1;
    const newQuestion = { ...question, id: newId.toString() };
    setQuestionsState([...questionsState, newQuestion]);
  };

  const updateQuestion = (id: number, question: Omit<Question, "id">) => {
    setQuestionsState((prev) =>
      prev.map((q) =>
        q.id === id.toString() ? { ...question, id: id.toString() } : q
      )
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestionsState((prev) => prev.filter((q) => q.id !== id.toString()));
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[id.toString()];
      return newAnswers;
    });
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
        setCurrentQuestionIndex,
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
