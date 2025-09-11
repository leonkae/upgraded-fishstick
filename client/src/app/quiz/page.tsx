import { QuestionnaireProvider } from "@/components/quiz/QuestionnaireContext";
import { QuestionnaireStepper } from "@/components/quiz/QuestionnaireStepper";

const Quiz = () => {
  return (
    <QuestionnaireProvider>
      <QuestionnaireStepper />
    </QuestionnaireProvider>
  );
};

export default Quiz;
