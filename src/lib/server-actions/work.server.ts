"use server";

import "server-only";

import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { z } from "zod";

import { withDb } from "@/db/db-helper";
import { requireAuth } from "@/lib/server-auth";
import type { ServerResponse } from "@/types/action-response.types";
import { workExperienceSchema } from "../validations/work.validation";
import { WorkExperience } from "@/models/WorkExpModel";
import type { WorkExperience as WorkExperienceType } from "@/types/work-experience.types";
import type { Types } from "mongoose";



export type CreateWorkExperienceInput =
  z.infer<typeof workExperienceSchema>;

/* -------------------------------------------------------------------------- */
/* GET                                                                        */
/* -------------------------------------------------------------------------- */

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

type WorkExperienceQuery = {
  _id: Types.ObjectId;
  role: string;
  company: string;
  location: string;
  techs: string;
  descriptions: {
      _id: Types.ObjectId;
      text: string;
  }[];
  currentlyWorking: boolean;
  startDate: Date;
  endDate?: Date | null;
};

async function getCachedWorkExperiences(): Promise<WorkExperienceType[]> {
  "use cache";

  cacheLife("max");
  cacheTag("work-experience");

  const experiences = await WorkExperience.find()
    .sort({ startDate: -1 })
    .lean<WorkExperienceQuery[]>();

  return experiences.map((experience) => ({
    _id: experience._id.toString(),
    role: experience.role,
    company: experience.company,
    location: experience.location,
    techs: experience.techs,
    descriptions:
      experience.descriptions?.map(
        (description) => ({
          _id: description._id.toString(),
          text: description.text,
        })
      ) ?? [],
    currentlyWorking:
      experience.currentlyWorking,
    startDate:
      experience.startDate.toISOString(),
    endDate:
      experience.endDate
        ? experience.endDate.toISOString()
        : null,
  }));
}

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function createWorkExperience(
  input: CreateWorkExperienceInput
) {
  try {
    /* ----------------------------- Auth ----------------------------- */

    const user = await requireAuth();

    /* --------------------------- Validation -------------------------- */

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

    /* ------------------------------ DB ------------------------------ */

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

    /* ------------------------- Cache invalidation ------------------- */

    revalidateTag("work-experience", "max");

    /* ---------------------------- Response -------------------------- */

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

    /*
     * Never send the actual database/auth error
     * to the client.
     */

    return {
      success: false,
      data: null,
      error:
        "Failed to create work experience.",
    } satisfies ServerResponse<never>;;
  }
}