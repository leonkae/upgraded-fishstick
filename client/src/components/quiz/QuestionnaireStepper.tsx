"use client";

import { PaymentScreen } from "@/components/quiz/PaymentScreen";
import { useQuestionnaire } from "@/components/quiz/QuestionnaireContext";
import { QuestionScreen } from "@/components/quiz/QuestionScreen";
import { ResultScreen } from "@/components/quiz/ResultScreen";
import { WelcomeScreen } from "@/components/quiz/WelcomeScreen";

const QuestionnaireStepper = () => {
  const { currentStep } = useQuestionnaire();

  return (
    <div className="min-h-screen">
      {currentStep === "welcome" && <WelcomeScreen />}
      {currentStep === "question" && <QuestionScreen />}
      {currentStep === "payment" && <PaymentScreen />}
      {currentStep === "result" && <ResultScreen />}
    </div>
  );
};

export { QuestionnaireStepper };
