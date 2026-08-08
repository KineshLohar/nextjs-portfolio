
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