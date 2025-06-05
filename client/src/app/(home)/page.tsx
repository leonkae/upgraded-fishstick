import { Header } from "../../components/shared/header";
import { DiscoverYourPath } from "../../components/home/discoverYourPath";
import { Hero } from "../../components/home/hero";
import { HowItWorks } from "../../components/home/howItWorks";
import { ReadyToDiscover } from "../../components/home/readyToDiscover";
import { Testimonials } from "../../components/home/testimonials";
import { QuizPreview } from "../../components/home/quizPreview";
import { Footer } from "../../components/shared/footer";

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
      <Footer />
    </>
  );
};

export default Home;
