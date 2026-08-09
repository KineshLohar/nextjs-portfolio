"use server"

import { updateTag } from "next/cache";

import connectDB from "@/db/connectDB";
import Skill from "@/models/SkillModel";
import type { ServerResponse } from "@/types/action-response.types";
import { uploadToCloudinary } from "../cloudinary";
import { requireAuth } from "../server-auth";
import { createSkillSchema, type CreateSkillInput } from "../validations/skill.validation";



export type SkillOption = {
  _id: string;
  skill: string;
};




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