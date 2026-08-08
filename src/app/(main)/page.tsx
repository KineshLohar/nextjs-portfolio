
import { AboutSection } from "@/components/viewer/about/about-section";
import { ContactSection } from "@/components/viewer/contact/contact-section";
import { HeroSection } from "@/components/viewer/hero/hero-section";
import { ProjectsSection } from "@/components/viewer/projects/projects-section";
import { SkillsSection } from "@/components/viewer/skills/skill-section";
import { Socials } from "@/components/viewer/socials/socials";
import { WorkExpSection } from "@/components/viewer/work-exp/work-exp-section";
import { cacheLife, cacheTag } from "next/cache";

export default async function Home() {
  "use cache";
  cacheLife("max");
  cacheTag("home");
  
  return (
    <div className="max-w-full select-none overflow-hidden">
      <HeroSection />
      <Socials />
      <AboutSection />
      <WorkExpSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
