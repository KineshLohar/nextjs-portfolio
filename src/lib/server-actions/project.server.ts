import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { Types } from "mongoose";

import connectDB from "@/db/connectDB";
import ProjectModel from "@/models/ProjectsModel";
import type { ServerResponse } from "@/types/action-response.types";
import type { ProjectType } from "@/types/project.types";

type ProjectQueryResult = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  demoLink?: string;
  repoLink?: string;

  thumbnail: {
    id: string;
    url: string;
  };

  images: {
    public_id: string;
    url: string;
    caption: string;
  }[];

  techs: Array<{
    _id: Types.ObjectId;
    skill: string;
    logo: {
      public_id: string;
      url: string;
    } | null;
  }>;
};

function serializeProject(
  project: ProjectQueryResult
): ProjectType {
  return {
    _id: project._id.toString(),

    title: project.title,

    description: project.description,

    demoLink: project.demoLink ?? null,

    repoLink: project.repoLink ?? null,

    thumbnail: {
      id: project.thumbnail.id,
      url: project.thumbnail.url,
    },

    images: project.images.map((image) => ({
      public_id: image.public_id,
      url: image.url,
      caption: image.caption,
    })),

    techs: project.techs.map((tech) => ({
      _id: tech._id.toString(),

      skill: tech.skill,

      logo: tech.logo
        ? {
            public_id: tech.logo.public_id,
            url: tech.logo.url,
          }
        : null,
    })),
  };
}

export async function getFeaturedProjects(): Promise<
  ServerResponse<ProjectType[]>
> {
  "use cache";

  cacheLife("max");
  cacheTag("projects");

  try {
    await connectDB();

    const projects = await ProjectModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("techs", "_id skill logo")
      .lean<ProjectQueryResult[]>();

    const data: ProjectType[] = projects.map(serializeProject);

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error("[getFeaturedProjects]", error);

    return {
      success: false,
      data: null,
      error: "Failed to load projects.",
    };
  }
}

export async function getProjects(): Promise<
  ServerResponse<ProjectType[]>
> {
  "use cache";

  cacheLife("max");
  cacheTag("projects");

  try {
    await connectDB();

    const projects = await ProjectModel.find()
      .sort({ createdAt: -1 })
      .populate("techs", "_id skill logo")
      .lean<ProjectQueryResult[]>();

    return {
      success: true,
      data: projects.map(serializeProject),
      error: null,
    };
  } catch (error) {
    console.error("[getProjects]", error);

    return {
      success: false,
      data: null,
      error: "Failed to load projects.",
    };
  }
}