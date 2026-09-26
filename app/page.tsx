import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Intro from "@/components/home/Intro";
import Stats from "@/components/home/Stats";
import Programs from "@/components/home/Programs";
import Experience from "@/components/home/Experience";
import ServicesTeaser from "@/components/home/ServicesTeaser";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main id="primary" className="releve-home">
      <Hero />
      <Marquee />
      <Intro />
      <Stats />
      <Programs />
      <Experience />
      <ServicesTeaser />
      <ContactSection />
    </main>
  );
}
