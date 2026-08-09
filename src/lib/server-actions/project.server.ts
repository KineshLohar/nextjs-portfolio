"use server"

import { updateTag } from "next/cache";
import ProjectModel, { type ProjectRaw } from "@/models/ProjectsModel";
import type { ServerResponse } from "@/types/action-response.types";
import { requireAuth } from "../server-auth";
import z from "zod";
import { uploadToCloudinary } from "../cloudinary";
import { withDb } from "@/db/db-helper";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const imageFileSchema = z
  .instanceof(File, {
    message: "Image is required.",
  })
  .refine(
    (file) => file.size > 0,
    "Image cannot be empty."
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Image must be less than 5MB."
  )
  .refine(
    (file) =>
      ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      ),
    "Only JPG, PNG, and WebP images are allowed."
  );

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required."),

  description: z
    .string()
    .trim()
    .min(1, "Project description is required."),

  demoLink: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  repoLink: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  techs: z
    .array(z.string())
    .default([]),

  thumbnail: imageFileSchema,

  images: z
    .array(
      z.object({
        file: imageFileSchema,
        caption: z
          .string()
          .trim()
          .min(1, "Image caption is required."),
      })
    )
    .default([]),
});

export type CreateProjectInput = z.infer<
  typeof createProjectSchema
>;

export async function createProject(
  input: CreateProjectInput
): Promise<ServerResponse<ProjectRaw>> {
  try {
    await requireAuth();

    const parsed =
      createProjectSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid project data.",
      };
    }

    const {
      title,
      description,
      demoLink,
      repoLink,
      techs,
      thumbnail,
      images,
    } = parsed.data;

    const thumbnailBuffer = Buffer.from(
      await thumbnail.arrayBuffer()
    );

    const thumbnailResult =
      await uploadToCloudinary(
        thumbnailBuffer,
        thumbnail.type,
        {
          folder: "projects/thumbnails",
        }
      );

    const imageResults = await Promise.all(
      images.map(async ({ file, caption }) => {
        const buffer = Buffer.from(
          await file.arrayBuffer()
        );

        const result =
          await uploadToCloudinary(
            buffer,
            file.type,
            {
              folder: "projects/images",
            }
          );

        return {
          public_id: result.public_id,
          url: result.secure_url,
          caption,
        };
      })
    );

    const project = await withDb(async () => {
      return ProjectModel.create({
        title,
        description,
        demoLink: demoLink || undefined,
        repoLink: repoLink || undefined,
        techs,
        thumbnail: {
          id: thumbnailResult.public_id,
          url: thumbnailResult.secure_url,
        },
        images: imageResults,
      });
    });

    updateTag("projects");

    return {
      success: true,
      data: project.toObject(),
      error: null,
    };
  } catch (error) {
    console.error(
      "[createProject]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to create project.",
    };
  }
}