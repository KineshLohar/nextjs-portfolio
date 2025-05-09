import { AboutSection } from "@/components/viewer/about/about-section";
import { CTA } from "@/components/viewer/cta/cta";
import { HeroSection } from "@/components/viewer/hero/hero-section";
import { ProjectsSection } from "@/components/viewer/projects/projects-section";
import { SkillsSection } from "@/components/viewer/skills/skill-section";
import { Socials } from "@/components/viewer/socials/socials";
import SocialsMaarquee from "@/components/viewer/socials/socials-marquee";
import { WorkExpSection } from "@/components/viewer/work-exp/work-exp-section";


export default function Home() {
  return (
    <div className="max-w-full select-none overflow-hidden">
      <HeroSection />
      {/* <p className=" font-semibold text-5xl mb-20">Everything App for your teams</p> */}
      {/* <SocialsMaarquee /> */}
      <Socials />
      <AboutSection />
      <WorkExpSection />
      <ProjectsSection />
      <SkillsSection />
      <CTA />
    </div>
  );
}
