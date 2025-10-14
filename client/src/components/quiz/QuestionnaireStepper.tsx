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
      <div style={{ display: currentStep === "welcome" ? "block" : "none" }}>
        <WelcomeScreen />
      </div>

      <div style={{ display: currentStep === "question" ? "block" : "none" }}>
        <QuestionScreen />
      </div>

      <div style={{ display: currentStep === "payment" ? "block" : "none" }}>
        <PaymentScreen />
      </div>

      <div style={{ display: currentStep === "result" ? "block" : "none" }}>
        <ResultScreen />
      </div>
    </div>
  );
};

export { QuestionnaireStepper };
