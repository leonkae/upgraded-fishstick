// QuestionnaireContext.tsx

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
    value: number; // The score
  }[];
}

// Define user info interface
interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

// NEW: Answers now store the selected Option ID (string)
// Record<Question ID, Option ID>
type AnswersRecord = Record<string, string>;

// Define the type for a single response object the server expects
interface ServerResponse {
  questionId: string;
  questionText: string;
  score: number; // Must be a number!
  optionId: string; // Must be present
  selectedOption: string; // Must be present
}

// Define the full payload type the server expects
interface ServerPayload {
  userInfo: UserInfo;
  responses: ServerResponse[];
}

// Define context type
interface QuestionnaireContextType {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: AnswersRecord;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  setAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  currentStep: "welcome" | "question" | "payment" | "result";
  setCurrentStep: (step: "welcome" | "question" | "payment" | "result") => void;
  calculateScore: () => number;
  resetQuestionnaire: () => void;
  // ⭐ NEW function to expose the correctly formatted data for the API
  getSubmissionPayload: () => ServerPayload;
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
  const [answers, setAnswers] = useState<AnswersRecord>({});
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "question" | "payment" | "result"
  >("welcome");

  // Load progress and set step (FIRST useEffect - unchanged)
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

  // Load progress and set answers/index/userInfo (SECOND useEffect - unchanged)
  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      if (saved.answers) {
        const normalizedAnswers: AnswersRecord = {};
        Object.entries(saved.answers).forEach(([qId, opt]) => {
          normalizedAnswers[qId] = String(opt);
        });
        setAnswers(normalizedAnswers);
      }

      setCurrentQuestionIndex(saved.currentQuestionIndex || 0);
      setUserInfo(saved.userInfo || { name: "", email: "", phone: "" });

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

  // Persist progress to localStorage (THIRD useEffect - unchanged, handles local storage legacy format)
  useEffect(() => {
    const answersForSaving: Record<string, number> = {};

    if (questionsState.length > 0) {
      Object.entries(answers).forEach(([questionId, optionId]) => {
        const question = questionsState.find((q) => q.id === questionId);
        if (question) {
          const selectedOption = question.options.find(
            (o) => o.id === optionId
          );
          if (selectedOption) {
            answersForSaving[questionId] = selectedOption.value;
          }
        }
      });
    }

    saveQuizProgress({
      answers: answersForSaving,
      currentQuestionIndex,
      currentStep,
      userInfo,
    });
  }, [answers, currentQuestionIndex, currentStep, userInfo, questionsState]);

  // Fetch quiz questions from backend (unchanged)
  useEffect(() => {
    const fetchQuestions = async () => {
      // ... (API fetch logic is unchanged)

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

  // setAnswer (stores Option ID string - CORRECT)
  const setAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // calculateScore (derives score from Option ID string - CORRECT)
  const calculateScore = () => {
    // ... (logic is correct and unchanged)
    const totalPossibleScore = questionsState.length * 10;
    let userScore = 0;

    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = questionsState.find((q) => q.id === questionId);
      if (question) {
        const selectedOption = question.options.find((o) => o.id === optionId);
        if (selectedOption) {
          userScore += selectedOption.value;
        }
      }
    });

    return (userScore / totalPossibleScore) * 100;
  };

  const getSubmissionPayload = (): ServerPayload => {
    const responsesPayload: ServerResponse[] = [];

    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = questionsState.find((q) => q.id === questionId);

      if (!question) {
        console.warn(
          `Skipping submission for Question ID ${questionId}: not found in state.`
        );
        return;
      }

      const selectedOption = question.options.find((o) => o.id === optionId);

      if (!selectedOption) {
        console.warn(
          `Skipping submission for Question ID ${questionId}: Option ID ${optionId} not found.`
        );
        return;
      }

      responsesPayload.push({
        questionId: question.id,
        questionText: question.text,
        optionId: selectedOption.id, // Required: Option ID (string)
        selectedOption: selectedOption.text, // Required: Option Text (string)
        score: selectedOption.value, // Required: Score (number) - FIXES the Cast to Number error
      });
    });

    return {
      userInfo: userInfo,
      responses: responsesPayload,
    };
  };

  // ... (rest of context functions are correct and unchanged)
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
        getSubmissionPayload, // ⭐ EXPOSE THE NEW FUNCTION
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
