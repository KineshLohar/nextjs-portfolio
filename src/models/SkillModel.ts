// src/models/SkillModel.ts

import mongoose, {
  InferRawDocType,
  type Model,
} from "mongoose";

import { taskBasedCategories } from "@/constants/constants";

const skillSchemaDefinition = {
  userId: {
    type: String,
    required: true,
  },

  skill: {
    type: String,
    required: true,
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },

  type: {
    type: String,
    enum: taskBasedCategories,
    required: true,
  },

  experience: {
    type: String,
  },

  projects: {
    type: String,
  },

  description: {
    type: String,
  },

  logo: {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
} as const;

const skillSchema = new mongoose.Schema(skillSchemaDefinition, {
  timestamps: true,
});

export type SkillRaw = InferRawDocType<typeof skillSchemaDefinition>;

export type SkillDocument = mongoose.HydratedDocument<SkillRaw>;

const Skill: Model<SkillRaw> =
  mongoose.models.Skill ||
  mongoose.model<SkillRaw>("Skill", skillSchema);

export default Skill;