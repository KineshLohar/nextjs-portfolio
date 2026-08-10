"use server";

import { WorkExperience } from "@/models/WorkExpModel";
import type { WorkExperienceType } from "@/types/work-experience.types";
import { cacheLife, cacheTag } from 'next/cache';

type WorkExperienceQuery = {
    _id: {
        toString(): string;
    };
    role: string;
    company: string;
    location: string;
    techs: string;
    descriptions?: {
        _id: {
            toString(): string;
        };
        text: string;
    }[];
    currentlyWorking: boolean;
    startDate: Date;
    endDate?: Date | null;
};
  

export async function getCachedWorkExperiences(): Promise<WorkExperienceType[]> {
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