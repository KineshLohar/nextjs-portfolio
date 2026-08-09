import mongoose, {
  InferRawDocType,
  type Model,
} from "mongoose";

import "./SkillModel";

const projectSchemaDefinition = {
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  demoLink: {
    type: String,
  },

  repoLink: {
    type: String,
  },

  techs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],

  thumbnail: {
    id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },

  images: [
    {
      _id: false,
      public_id: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      caption: {
        type: String,
        required: true,
      },
    },
  ],
} as const;

const projectsSchema = new mongoose.Schema(projectSchemaDefinition, {
  timestamps: true,
});

export type ProjectRaw = InferRawDocType<
  typeof projectSchemaDefinition
>;

export type ProjectDocument =
  mongoose.HydratedDocument<ProjectRaw>;

const ProjectModel: Model<ProjectRaw> =
  mongoose.models.Project ||
  mongoose.model<ProjectRaw>("Project", projectsSchema);

export default ProjectModel;