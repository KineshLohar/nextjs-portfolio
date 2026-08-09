"use server";

import connectDB from "@/db/connectDB";
import Skill from "@/models/SkillModel";
import type { ServerResponse } from "@/types/action-response.types";
import type { SkillAggregationItem, SkillSectionType } from "@/types/skill.types";
import type { Types } from "mongoose";
import { cacheLife, cacheTag } from "next/cache";


type SkillAggregationResult = {
    type: string;
    skills: Array<
      Omit<SkillAggregationItem, "_id"> & {
        _id: Types.ObjectId;
      }
    >;
  };

export async function getSkills(): Promise<
    ServerResponse<SkillSectionType[]>
> {
    "use cache";

    cacheLife("max");
    cacheTag("skills");

    try {
        await connectDB();

        const data = await Skill.aggregate<SkillAggregationResult>([
            {
                $group: {
                    _id: "$type",
                    skills: {
                        $push: {
                            _id: "$_id",
                            skill: "$skill",
                            level: "$level",
                            experience: "$experience",
                            projects: "$projects",
                            logo: "$logo",
                            description: "$description",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    skills: 1,
                },
            },
        ]);

        const serializedData: SkillSectionType[] = data.map((section) => ({
            type: section.type,

            skills: section.skills.map((skill) => ({
                _id: String(skill._id),
                skill: skill.skill,
                level: skill.level,
                experience: skill.experience ?? null,
                projects: skill.projects ?? null,
                logo: skill.logo
                    ? {
                        public_id: skill.logo.public_id,
                        url: skill.logo.url,
                    }
                    : null,
                description: skill.description ?? null,
            })),
        }));

        return {
            success: true,
            data: serializedData,
            error: null,
        };
    } catch (error) {
        console.error("[getSkills]", error);

        return {
            success: false,
            data: null,
            error: "Failed to load skills.",
        };
    }
}

