import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import connectDB from "@/db/connectDB";
import ResumeModel from "@/models/ResumeModel";

import type { ServerResponse } from "@/types/action-response.types";

export interface ResumeData {
  _id: string;
  resumeId: number;
  link: string;
}

export async function getResume(): Promise<
  ServerResponse<ResumeData | null>
> {
  "use cache";

  cacheLife("max");
  cacheTag("resume");

  try {
    await connectDB();

    const resume = await ResumeModel.findOne({
      resumeId: 1,
    }).lean<{
      _id: unknown;
      resumeId: number;
      link: string;
    }>();

    if (!resume) {
      return {
        success: true,
        data: null,
        error: null,
      };
    }

    return {
      success: true,
      data: {
        _id: String(resume._id),
        resumeId: resume.resumeId,
        link: resume.link,
      },
      error: null,
    };
  } catch (error) {
    console.error("[getResume]", error);

    return {
      success: false,
      data: null,
      error: "Failed to load resume.",
    };
  }
}