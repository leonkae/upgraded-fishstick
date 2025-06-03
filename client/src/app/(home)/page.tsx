import { DiscoverYourPath } from "../../components/home/discoverYourPath";
import { Header } from "../../components/home/header";
import { Hero } from "../../components/home/hero";
import { HowItWorks } from "../../components/home/howItWorks";
import { ReadyToDiscover } from "../../components/home/readyToDiscover";
import { Testimonials } from "../../components/home/testimonials";
import { QuizPreview } from "../../components/home/quizPreview";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <DiscoverYourPath />
      <QuizPreview />
      <Testimonials />
      <ReadyToDiscover />
    </>
  );
};

export default Home;
