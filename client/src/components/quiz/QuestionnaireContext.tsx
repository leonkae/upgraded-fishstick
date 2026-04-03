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

// Interfaces for Raw API Responses to replace 'any'
interface RawOption {
  _id: string;
  label: string;
  score: number;
}

interface RawQuestion {
  _id: string;
  text: string;
  options: RawOption[];
}

interface ApiResponse {
  success?: boolean;
  quiz?: RawQuestion[];
  data?: {
    quiz?: RawQuestion[];
    data?: FinalResult[];
  };
}

// Define user info interface
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  ageRange?: string;
  wantsDiscipleship?: boolean | null;
}

type AnswersRecord = Record<string, string>;

interface ServerResponse {
  questionId: string;
  questionText: string;
  score: number;
  optionId: string;
  selectedOption: string;
}

interface ServerPayload {
  userInfo: UserInfo;
  responses: ServerResponse[];
}

interface FinalResult {
  _id?: string;
  userInfo?: UserInfo;
  responses?: Array<{
    questionId: string;
    optionId: string;
    questionText?: string;
    selectedOption?: string;
    score?: number;
    _id?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: unknown; // Changed from 'any' to 'unknown' to fix Line 86 error
}

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
  getSubmissionPayload: () => ServerPayload;
  addQuestion: (question: Omit<Question, "id">) => void;
  updateQuestion: (id: string, question: Omit<Question, "id">) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setQuestions: (questions: Question[]) => void;
  finalResult: FinalResult | null;
  fetchFinalResult: (responseId?: string) => Promise<FinalResult | null>;
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

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
  });

  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      if (saved.answers && typeof saved.answers === "object") {
        const entries = Object.entries(saved.answers);
        const normalized: AnswersRecord = {};
        let foundStringIds = false;
        entries.forEach(([qId, val]) => {
          if (typeof val === "string") {
            normalized[qId] = val;
            foundStringIds = true;
          }
        });
        if (foundStringIds) {
          setAnswers(normalized);
        }
      }

      if (typeof saved.currentQuestionIndex === "number") {
        setCurrentQuestionIndex(saved.currentQuestionIndex);
      }

      if (saved.userInfo) {
        setUserInfo(saved.userInfo);
      }
      setCurrentStep(saved.currentStep || "welcome");
    }
  }, []);

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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/quiz");
        const data: ApiResponse = await res.json();

        let questionsArray: RawQuestion[] = [];

        if (data.success && Array.isArray(data.quiz)) {
          questionsArray = data.quiz;
        } else if (Array.isArray(data)) {
          questionsArray = data as unknown as RawQuestion[];
        } else if (data.data && Array.isArray(data.data.quiz)) {
          questionsArray = data.data.quiz;
        }

        if (questionsArray.length > 0) {
          const mapped = questionsArray.map((q: RawQuestion) => ({
            id: q._id,
            text: q.text,
            options: q.options.map((opt: RawOption) => ({
              id: opt._id,
              text: opt.label,
              value: opt.score,
            })),
          }));
          setQuestionsState(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const setAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const calculateScore = () => {
    const totalPossibleScore = questionsState.reduce((acc, q) => {
      const maxOption = q.options.reduce(
        (m, o) => (o.value > m ? o.value : m),
        0
      );
      return acc + (maxOption || 10);
    }, 0);

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

    if (totalPossibleScore === 0) return 0;
    return (userScore / totalPossibleScore) * 100;
  };

  const getSubmissionPayload = (): ServerPayload => {
    const responsesPayload: ServerResponse[] = [];

    Object.entries(answers).forEach(([questionId, optionId]) => {
      const question = questionsState.find((q) => q.id === questionId);
      if (!question) return;

      const selectedOption = question.options.find((o) => o.id === optionId);
      if (!selectedOption) return;

      responsesPayload.push({
        questionId: question.id,
        questionText: question.text,
        optionId: selectedOption.id,
        selectedOption: selectedOption.text,
        score: selectedOption.value,
      });
    });

    return {
      userInfo: {
        ...userInfo,
        wantsDiscipleship: userInfo.wantsDiscipleship ?? null,
      },
      responses: responsesPayload,
    };
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

  const resetQuestionnaire = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentStep("welcome");
    setUserInfo({ name: "", email: "", phone: "" });
    setFinalResult(null);
    clearQuizProgress();
  };

  const addQuestion = (question: Omit<Question, "id">) => {
    const newId =
      questionsState.length > 0
        ? (
            Math.max(...questionsState.map((q) => Number(q.id) || 0)) + 1
          ).toString()
        : "1";
    const newQuestion = { ...question, id: newId };
    setQuestionsState([...questionsState, newQuestion]);
  };

  const updateQuestion = (id: string, question: Omit<Question, "id">) => {
    setQuestionsState((prev) =>
      prev.map((q) => (q.id === id ? { ...question, id: id } : q))
    );
  };

  const deleteQuestion = (id: string) => {
    setQuestionsState((prev) => prev.filter((q) => q.id !== id));
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[id];
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

  const fetchFinalResult = async (
    responseId?: string
  ): Promise<FinalResult | null> => {
    try {
      if (responseId) {
        const singleRes = await fetch(
          `http://localhost:3005/api/v1/responses/${encodeURIComponent(responseId)}`
        );
        if (singleRes.ok) {
          const parsed = await singleRes.json();
          const candidate = (parsed?.data || parsed) as FinalResult;
          setFinalResult(candidate);
          return candidate;
        }
      }

      const listRes = await fetch("http://localhost:3005/api/v1/responses");
      if (!listRes.ok) return null;

      const listJson = await listRes.json();

      const arr: FinalResult[] =
        listJson?.data?.data && Array.isArray(listJson.data.data)
          ? listJson.data.data
          : Array.isArray(listJson)
            ? listJson
            : listJson?.data && Array.isArray(listJson.data)
              ? listJson.data
              : [];

      let found = null;
      if (responseId) {
        found = arr.find((r: FinalResult) => r._id === responseId);
      }
      if (!found) {
        found = arr[0] || null;
      }
      if (found) {
        setFinalResult(found);
        return found;
      }
      return null;
    } catch (err) {
      console.error("Error fetching final result:", err);
      return null;
    }
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
        getSubmissionPayload,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        reorderQuestions,
        setQuestions,
        finalResult,
        fetchFinalResult,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};
