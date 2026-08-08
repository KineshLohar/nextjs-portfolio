import { withDb } from "@/db/db-helper";
import { WorkExperience } from "@/models/WorkExpModel";
import { cacheLife, cacheTag } from "next/cache";

export async function getWorkExperiences() {
    return withDb(async () => getCachedWorkExperiences());
  }
  
  async function getCachedWorkExperiences() {
    // "use cache";
  
    // cacheLife("max");
    // cacheTag("work-experience");
  
    return WorkExperience.find()
      .sort({ startDate: -1 })
      .lean();
  }