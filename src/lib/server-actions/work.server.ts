"use server";

import "server-only";

import { revalidateTag, updateTag } from "next/cache";
import { z } from "zod";

import { withDb } from "@/db/db-helper";
import { requireAuth } from "@/lib/server-auth";
import type { ServerResponse } from "@/types/action-response.types";
import { workExperienceSchema, type WorkExperienceInput } from "../validations/work.validation";
import { WorkExperience } from "@/models/WorkExpModel";
import { getCachedWorkExperiences } from "../data/work-experience";



export type CreateWorkExperienceInput =
  z.infer<typeof workExperienceSchema>;

export async function getWorkExperiences() {
  try {
    const data = await withDb(
      () => getCachedWorkExperiences()
    );

    return {
      success: true,
      data,
      error: null,
    } satisfies ServerResponse<typeof data>;
  } catch (error) {
    console.error(
      "[getWorkExperiences]",
      error
    );

    return {
      success: false,
      data: null,
      error:
        "Failed to load work experiences.",
    } satisfies ServerResponse<never>;;
  }
}

export async function createWorkExperience(
  input: CreateWorkExperienceInput
) {
  try {
    const user = await requireAuth();

    const parsed =
      workExperienceSchema.safeParse(input);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ??
        "Invalid work experience data.";

      return {
        success: false,
        data: null,
        error: firstError,
      } satisfies ServerResponse<never>;
    }

    const data = await withDb(
      async () => {
        const created =
          await WorkExperience.create({
            ...parsed.data,
            userId: user.id,
          });

        return created.toObject();
      }
    );


    revalidateTag("work-experience", "max");

    return {
      success: true,
      data,
      error: null,
    } satisfies ServerResponse<typeof data>;
  } catch (error) {
    console.error(
      "[createWorkExperience]",
      error
    );

    return {
      success: false,
      data: null,
      error:
        "Failed to create work experience.",
    } satisfies ServerResponse<never>;;
  }
}

export async function updateWorkExperience(
  id: string,
  input: WorkExperienceInput
) {
  try {
    const user = await requireAuth();

    if (!id) {
      return {
        success: false,
        data: null,
        error:
          "Work experience ID is required.",
      } satisfies ServerResponse<never>;
    }

    const parsed =
      workExperienceSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid work experience data.",
      } satisfies ServerResponse<never>;
    }

    const data = await withDb(
      async () => {
        const existing =
          await WorkExperience.findById(
            id
          );

        if (!existing) {
          throw new Error(
            "WORK_EXPERIENCE_NOT_FOUND"
          );
        }

        console.log("USER", JSON.stringify(user), JSON.stringify(existing));

        existing.role =
          parsed.data.role;

        existing.company =
          parsed.data.company;

        existing.location =
          parsed.data.location;

        existing.techs =
          parsed.data.techs;

        existing.descriptions =
          parsed.data.descriptions;

        existing.startDate =
          parsed.data.startDate;

        existing.currentlyWorking =
          parsed.data.currentlyWorking;

        existing.endDate =
          parsed.data.currentlyWorking
            ? undefined
            : parsed.data.endDate;

        await existing.save();

        return existing.toObject();
      }
    );

    updateTag(
      "work-experience"
    );

    return {
      success: true,
      data,
      error: null,
    } satisfies ServerResponse<typeof data>;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
      "WORK_EXPERIENCE_NOT_FOUND"
    ) {
      return {
        success: false,
        data: null,
        error:
          "Work experience not found.",
      } satisfies ServerResponse<never>;
    }

    if (
      error instanceof Error &&
      error.message ===
      "WORK_EXPERIENCE_UNAUTHORIZED"
    ) {
      return {
        success: false,
        data: null,
        error:
          "You are not authorized to update this work experience.",
      } satisfies ServerResponse<never>;
    }

    console.error(
      "[updateWorkExperience]",
      error
    );

    return {
      success: false,
      data: null,
      error:
        "Failed to update work experience.",
    } satisfies ServerResponse<never>;
  }
}

export async function deleteWorkExperience(
  id: string
) {
  try {
    const user = await requireAuth();

    if (!id) {
      return {
        success: false,
        data: null,
        error:
          "Work experience ID is required.",
      } satisfies ServerResponse<never>;
    }

    await withDb(async () => {
      const existing =
        await WorkExperience.findById(id);

      if (!existing) {
        throw new Error(
          "WORK_EXPERIENCE_NOT_FOUND"
        );
      }

      if (
        String(existing.userId) !==
        String(user.id)
      ) {
        throw new Error(
          "WORK_EXPERIENCE_UNAUTHORIZED"
        );
      }

      await WorkExperience.findByIdAndDelete(
        id
      );
    });

    revalidateTag(
      "work-experience",
      "max"
    );

    return {
      success: true,
      data: null,
      error: null,
    } satisfies ServerResponse<null>;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
      "WORK_EXPERIENCE_NOT_FOUND"
    ) {
      return {
        success: false,
        data: null,
        error:
          "Work experience not found.",
      } satisfies ServerResponse<never>;
    }

    if (
      error instanceof Error &&
      error.message ===
      "WORK_EXPERIENCE_UNAUTHORIZED"
    ) {
      return {
        success: false,
        data: null,
        error:
          "You are not authorized to delete this work experience.",
      } satisfies ServerResponse<never>;
    }

    console.error(
      "[deleteWorkExperience]",
      error
    );

    return {
      success: false,
      data: null,
      error:
        "Failed to delete work experience.",
    } satisfies ServerResponse<never>;
  }
}