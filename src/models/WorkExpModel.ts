import { Schema, model, models, InferSchemaType } from "mongoose";

const workExperienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    techs: {
      type: String,
      required: true,
    },

    descriptions: [
      {
        text: String,
      },
    ],

    currentlyWorking: Boolean,

    startDate: {
      type: Date,
      required: true,
    },

    endDate: Date,
  },
  {
    timestamps: true,
  }
);

export type WorkExperienceDocument = InferSchemaType<
  typeof workExperienceSchema
>;

export const WorkExperience =
  models.WorkExperience ||
  model("WorkExperience", workExperienceSchema);