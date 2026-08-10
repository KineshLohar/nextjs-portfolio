"use server"

import "server-only";

import { updateTag } from "next/cache";

import connectDB from "@/db/connectDB";
import Skill from "@/models/SkillModel";
import type { ServerResponse } from "@/types/action-response.types";
import { deleteFromCloudinary, uploadToCloudinary } from "../cloudinary";
import { requireAuth } from "../server-auth";
import { createSkillSchema, updateSkillSchema, type CreateSkillInput, type UpdateSkillInput } from "../validations/skill.validation";

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

    try {
      await Skill.create({
        userId: user.id,
        skill,
        level,
        type,
        experience,
        projects,
        description,
        logo: {
          public_id:
            uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });
    } catch (error) {
      try {
        await deleteFromCloudinary(
          uploadResult.public_id
        );
      } catch (cleanupError) {
        console.error(
          "[createSkill] Cloudinary cleanup failed",
          cleanupError
        );
      }

      throw error;
    }

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

export async function updateSkill(
  skillId: string,
  input: UpdateSkillInput
): Promise<ServerResponse<null>> {
  try {
    const user = await requireAuth();

    if (!skillId) {
      return {
        success: false,
        data: null,
        error: "Skill ID is required.",
      };
    }

    const parsed =
      updateSkillSchema.safeParse(input);

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

    const skillDocument =
      await Skill.findById(skillId);

    if (!skillDocument) {
      return {
        success: false,
        data: null,
        error: "Skill not found.",
      };
    }

    if (
      String(skillDocument.userId) !==
      String(user.id)
    ) {
      return {
        success: false,
        data: null,
        error:
          "You are not authorized to update this skill.",
      };
    }

    const {
      skill,
      level,
      type,
      experience,
      projects,
      description,
      logo,
    } = parsed.data;

    const oldLogoPublicId =
      skillDocument.logo?.public_id;

    let newLogo:
      | {
        public_id: string;
        url: string;
      }
      | undefined;

    if (logo instanceof File) {
      const logoBuffer = Buffer.from(
        await logo.arrayBuffer()
      );

      const uploadResult =
        await uploadToCloudinary(
          logoBuffer,
          logo.type,
          {
            folder: "projects/skills",
          }
        );

      newLogo = {
        public_id:
          uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }

    try {
      skillDocument.skill = skill;
      skillDocument.level = level;
      skillDocument.type = type;
      skillDocument.experience =
        experience;
      skillDocument.projects = projects;
      skillDocument.description =
        description;

      if (newLogo) {
        skillDocument.logo = newLogo;
      }

      await skillDocument.save();
    } catch (error) {
      if (newLogo?.public_id) {
        try {
          await deleteFromCloudinary(
            newLogo.public_id
          );
        } catch (cleanupError) {
          console.error(
            "[updateSkill] New logo cleanup failed",
            cleanupError
          );
        }
      }

      throw error;
    }

    if (
      newLogo &&
      oldLogoPublicId &&
      oldLogoPublicId !==
      newLogo.public_id
    ) {
      try {
        await deleteFromCloudinary(
          oldLogoPublicId
        );
      } catch (error) {
        console.error(
          "[updateSkill] Old logo deletion failed",
          error
        );
      }
    }

    updateTag("skills");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error(
      "[updateSkill]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to update skill.",
    };
  }
}

export async function deleteSkill(
  skillId: string
): Promise<ServerResponse<null>> {
  try {
    const user = await requireAuth();

    if (!skillId) {
      return {
        success: false,
        data: null,
        error: "Skill ID is required.",
      };
    }

    await connectDB();

    const skill =
      await Skill.findById(skillId);

    if (!skill) {
      return {
        success: false,
        data: null,
        error: "Skill not found.",
      };
    }

    if (
      String(skill.userId) !==
      String(user.id)
    ) {
      return {
        success: false,
        data: null,
        error:
          "You are not authorized to delete this skill.",
      };
    }

    const logoPublicId =
      skill.logo?.public_id;

    await Skill.findByIdAndDelete(skillId);

    if (logoPublicId) {
      try {
        await deleteFromCloudinary(
          logoPublicId
        );
      } catch (error) {
        console.error(
          "[deleteSkill] Cloudinary deletion failed",
          error
        );
      }
    }

    updateTag("skills");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error(
      "[deleteSkill]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to delete skill.",
    };
  }
}