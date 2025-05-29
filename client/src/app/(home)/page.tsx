import { DiscoverYourPath } from "../../components/home/discoverYourPath";
import { Header } from "../../components/home/header";
import { Hero } from "../../components/home/hero";
import { HowItWorks } from "../../components/home/howItWorks";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <DiscoverYourPath />
    </>
  );
};

export default Home;
