const STORAGE_KEY = "quiz_progress";

interface QuizProgress {
  answers: Record<string, number>;
  currentQuestionIndex: number;
  currentStep: "welcome" | "question" | "payment" | "result";
  userInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export function saveQuizProgress(progress: QuizProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
  }
}

export function loadQuizProgress(): QuizProgress | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as QuizProgress) : null;
  } catch (error) {
    console.error("Failed to load quiz progress:", error);
    return null;
  }
}

export function clearQuizProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear quiz progress:", error);
  }
}
