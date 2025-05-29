import { Header } from "../../components/home/header";
import { Hero } from "../../components/home/hero";
import { HowItWorks } from "../../components/home/howItWorks";
import { QuizPreview } from "../../components/home/quizPreview";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <QuizPreview />
    </>
  );
};

export default Home;
