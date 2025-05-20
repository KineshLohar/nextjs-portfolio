

import dynamic from "next/dynamic";
import { AboutSection } from "@/components/viewer/about/about-section";
import { HeroSection } from "@/components/viewer/hero/hero-section";
import { ProjectsSection } from "@/components/viewer/projects/projects-section";
import { SkillsSection } from "@/components/viewer/skills/skill-section";
import { Socials } from "@/components/viewer/socials/socials";
import { WorkExpSection } from "@/components/viewer/work-exp/work-exp-section";
import connectDB from "@/db/connectDB";
import { ComponentType } from "react";

const ContactSection = dynamic(() =>
  import('@/components/viewer/contact/contact-section').then((mod) => mod.ContactSection)
) as ComponentType;

connectDB();

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
      {/* <CTA /> */}
      <ContactSection />
    </div>
  );
}
