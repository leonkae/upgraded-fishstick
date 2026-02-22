import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import WhatsAppWidget from "@/components/shared/whatsAppWidget";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <WhatsAppWidget />
      {children}
      <Footer />
    </>
  );
};

export default HomeLayout;
