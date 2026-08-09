"use server"

import { updateTag } from "next/cache";

import connectDB from "@/db/connectDB";
import Skill from "@/models/SkillModel";
import type { ServerResponse } from "@/types/action-response.types";
import { uploadToCloudinary } from "../cloudinary";
import z from "zod";
import { taskBasedCategories } from "@/constants/constants";
import { requireAuth } from "../server-auth";



export type SkillOption = {
  _id: string;
  skill: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const imageFileSchema = z
  .instanceof(File, {
    message: "Logo is required.",
  })
  .refine(
    (file) => file.size > 0,
    "Logo cannot be empty."
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "Logo must be less than 5MB."
  )
  .refine(
    (file) =>
      ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
      ),
    "Only JPG, PNG, and WebP images are allowed."
  );

export const createSkillSchema = z.object({
  skill: z
    .string()
    .trim()
    .min(1, "Skill is required."),

  level: z.enum([
    "Beginner",
    "Intermediate",
    "Advanced",
  ]),

  type: z.enum(taskBasedCategories as [
    string,
    ...string[]
  ]),

  experience: z
    .string()
    .trim(),

  projects: z
    .string()
    .trim(),

  description: z
    .string()
    .trim(),

  logo: imageFileSchema,
});

export type CreateSkillInput = z.infer<
  typeof createSkillSchema>;



type CreateSkillResponse = ServerResponse<null>;

export async function getSkillOptions(): Promise<
  ServerResponse<SkillOption[]>
> {

  try {
    await connectDB();

    const skills = await Skill.find(
      {},
      {
        _id: 1,
        skill: 1,
      }
    )
      .sort({ skill: 1 })
      .lean();

    return {
      success: true,
      data: skills.map((skill) => ({
        _id: String(skill._id),
        skill: skill.skill,
      })),
      error: null,
    };
  } catch (error) {
    console.error(
      "[getSkillOptions]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to load skills.",
    };
  }
}

export async function createSkill(
  input: CreateSkillInput
): Promise<CreateSkillResponse> {
  try {
    const user = await requireAuth();

    const parsed = createSkillSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid skill data.",
      };
    }

    await connectDB();

    const {
      skill,
      level,
      type,
      experience,
      projects,
      description,
      logo,
    } = parsed.data;

    const logoBuffer = Buffer.from(
      await logo.arrayBuffer()
    );

    const uploadResult = await uploadToCloudinary(
      logoBuffer,
      logo.type,
      {
        folder: "projects/skills",
      }
    );

    await Skill.create({
      userId: user.id,
      skill,
      level,
      type,
      experience,
      projects,
      description,
      logo: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
    });

    updateTag("skills");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("[createSkill]", error);

    return {
      success: false,
      data: null,
      error: "Failed to create skill.",
    };
  }
}