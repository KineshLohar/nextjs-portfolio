
import type { SkillRaw } from "@/models/SkillModel";

export type SkillAggregationItem = Pick<
  SkillRaw,
  "skill" | "level" | "experience" | "projects" | "logo" | "description"
> & {
  _id: string;
};

export interface SkillSectionType {
  type: string;
  skills: SkillAggregationItem[];
}

export type SkillData = {
  _id: string;
  userId: string;
  skill: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  type: string;
  experience: string;
  projects: string;
  description: string;
  logo: {
      public_id: string;
      url: string;
  };
};