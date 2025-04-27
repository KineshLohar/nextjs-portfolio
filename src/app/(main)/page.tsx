import { AboutSection } from "@/components/viewer/about/about-section";
import { CTA } from "@/components/viewer/cta/cta";
import { SkillsSection } from "@/components/viewer/skills/skill-section";
import SocialsMaarquee from "@/components/viewer/socials/socials-marquee";


export default function Home() {
  return (
    <div className="max-w-full select-none overflow-hidden">

      {/* <p className=" font-semibold text-5xl mb-20">Everything App for your teams</p> */}
      {/* <SocialsMaarquee /> */}
      <AboutSection />
      <SkillsSection />
      <CTA />
    </div>
  );
}
