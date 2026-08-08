"use server";

import "server-only";

import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { z } from "zod";

import { withDb } from "@/db/db-helper";
import { WorkExperience } from "@/models/WorkExpModel";
import { requireAuth } from "@/lib/server-auth";
import type { ServerResponse } from "@/types/action-response.types";

export const workExperienceSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, "Role is required"),

  company: z
    .string()
    .trim()
    .min(1, "Company is required"),

  location: z
    .string()
    .trim(),

  techs: z
    .string()
    .trim()
    .min(1, "Technologies are required"),

  descriptions: z
    .array(
      z.object({
        text: z
          .string()
          .trim()
          .min(
            1,
            "Description is required"
          ),
      })
    )
    .min(
      1,
      "At least one description is required"
    ),

  startDate: z.date(),

  currentlyWorking: z.boolean(),

  endDate: z.date(),
}).superRefine((data, ctx) => {
  if (!data.currentlyWorking && data.endDate < data.startDate) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message:
        "End date must be after start date",
    });
  }
});

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

async function getCachedWorkExperiences(){
  "use cache";

  cacheLife("max");
  cacheTag("work-experience");

  return WorkExperience.find()
    .sort({ startDate: -1 })
    .lean();
}

/* -------------------------------------------------------------------------- */
/* CREATE                                                                     */
/* -------------------------------------------------------------------------- */

export async function createWorkExperience(
  input: CreateWorkExperienceInput
){
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