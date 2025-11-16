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

// Final result shape the backend returns (loosely typed)
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
  [k: string]: any;
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

  getSubmissionPayload: () => ServerPayload;
  addQuestion: (question: Omit<Question, "id">) => void;
  updateQuestion: (id: string, question: Omit<Question, "id">) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  setQuestions: (questions: Question[]) => void;

  // NEW: finalResult and helper to fetch it
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

  // finalResult holds the authoritative server copy of the saved submission
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  // SINGLE initialization effect: load saved quiz progress (no duplicate effects)
  useEffect(() => {
    const saved = loadQuizProgress();
    if (saved) {
      // answers stored in saved are numeric scores (legacy). We expect Option IDs in memory,
      // but we can only restore what we have. If saved.answers are numeric, we can't map back to option IDs here.
      // We still set currentQuestionIndex and userInfo, and restore currentStep (if present).
      // NOTE: saved.answers may be legacy numeric form; we do best-effort.
      if (saved.answers && typeof saved.answers === "object") {
        // If saved.answers values are numbers (legacy) we can't map to option ids.
        // So we only set answers if they look like optionId strings.
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

      // Respect saved.currentStep if present. Do not guess user's current step from presence of answers.
      setCurrentStep(saved.currentStep || "welcome");
    }
  }, []);

  // Persist progress whenever relevant state changes
  useEffect(() => {
    // Convert answers to a savable form: note we persist Option ID strings if present.
    // Some older saved forms might have numeric answers (scores); we don't convert those here.
    // The frontend local save used by your app expects numeric values for saved.answers in some places,
    // but we will persist option-value mapping (numbers) as before for backward compatibility.
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

  // Fetch quiz questions on mount
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

  // setAnswer (stores Option ID string)
  const setAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // calculateScore (derives score from Option ID string)
  const calculateScore = () => {
    const totalPossibleScore = questionsState.reduce((acc, q) => {
      // assume each question's max option value is 10 if not present
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
        optionId: selectedOption.id,
        selectedOption: selectedOption.text,
        score: selectedOption.value,
      });
    });

    return {
      userInfo: userInfo,
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

  // Fetch final result by response id (or fallback to list endpoint)
  const fetchFinalResult = async (
    responseId?: string
  ): Promise<FinalResult | null> => {
    try {
      if (responseId) {
        // try single response endpoint
        const singleRes = await fetch(
          `http://localhost:3005/api/v1/responses/${encodeURIComponent(responseId)}`
        );
        if (singleRes.ok) {
          const parsed = await singleRes.json();
          // many backends wrap in { success: true, data: ... }
          const candidate = parsed?.data || parsed;
          setFinalResult(candidate);
          return candidate;
        }
      }

      // fallback: fetch responses list and try to find by id or take the latest
      const listRes = await fetch("http://localhost:3005/api/v1/responses");
      if (!listRes.ok) {
        console.error("Failed to fetch responses list");
        return null;
      }
      const listJson = await listRes.json();
      // your backend returns shape: { success: true, data: { message: '', data: [ ... ] } }
      const arr =
        listJson?.data?.data && Array.isArray(listJson.data.data)
          ? listJson.data.data
          : Array.isArray(listJson)
            ? listJson
            : listJson?.data && Array.isArray(listJson.data)
              ? listJson.data
              : [];

      let found = null;
      if (responseId) {
        found = arr.find((r: any) => r._id === responseId);
      }
      if (!found) {
        // take first entry (most recent) if any
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
