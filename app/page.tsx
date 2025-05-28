

import Footer from "@/components/footer";
import HeroSection from "@/components/heroSection";
import HowItWorks from "@/components/howItWorks";
import Navbar from "@/components/navbar";
import WhyLovePeenly from "@/components/whyLovePeenly";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <WhyLovePeenly />
      <Footer/>
    </main>
  );
}
