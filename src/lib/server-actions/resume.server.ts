import type { ServerResponse } from "@/types/action-response.types";
import z from "zod";
import { requireAuth } from "../server-auth";
import connectDB from "@/db/connectDB";
import ResumeModel from "@/models/ResumeModel";
import { updateTag } from "next/cache";



export const updateResumeSchema = z.object({
  link: z
    .string()
    .trim()
    .min(1, "Resume link is required.")
    .url("Enter a valid resume URL."),
});

export type UpdateResumeInput = z.infer<
  typeof updateResumeSchema
>;


export async function updateResume(
  input: UpdateResumeInput
): Promise<ServerResponse<null>> {
  try {
    await requireAuth();

    const parsed =
      updateResumeSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        data: null,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid resume data.",
      };
    }

    await connectDB();

    await ResumeModel.findOneAndUpdate(
      { resumeId: 1 },
      {
        resumeId: 1,
        link: parsed.data.link,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    updateTag("resume");

    return {
      success: true,
      data: null,
      error: null,
    };
  } catch (error) {
    console.error("[updateResume]", error);

    return {
      success: false,
      data: null,
      error: "Failed to update resume.",
    };
  }
}