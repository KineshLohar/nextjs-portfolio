import type { SkillRaw } from "@/models/SkillModel";

export type PopulatedProjectSkill = {
  _id: string;
  skill: SkillRaw["skill"];
  logo: {
    public_id: string;
    url: string;
  } | null;
};

export type ProjectType = {
  _id: string;

  title: string;
  description: string;

  demoLink?: string | null;
  repoLink?: string | null;

  thumbnail: {
    id: string;
    url: string;
  };

  images: {
    public_id: string;
    url: string;
    caption: string;
  }[];

  techs: PopulatedProjectSkill[];
};