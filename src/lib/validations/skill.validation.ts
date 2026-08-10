import { taskBasedCategories } from "@/constants/constants";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

const imageFileSchema = z
    .instanceof(File, {
        message: "Logo is required.",
    })
    .refine(
        (file) => file.size > 0,
        "Logo cannot be empty."
    )
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Logo must be less than 5MB."
    )
    .refine(
        (file) =>
            ALLOWED_IMAGE_TYPES.includes(
                file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
            ),
        "Only JPG, PNG, and WebP images are allowed."
    );

const existingLogoSchema = z.object({
    public_id: z.string().min(1),
    url: z.string().url(),
});

const skillFieldsSchema = z.object({
    skill: z
        .string()
        .trim()
        .min(1, "Skill is required."),

    level: z.enum([
        "Beginner",
        "Intermediate",
        "Advanced",
    ]),

    type: z.enum(
        taskBasedCategories as [
            string,
            ...string[]
        ]
    ),

    experience: z
        .string()
        .trim(),

    projects: z
        .string()
        .trim(),

    description: z
        .string()
        .trim(),
});

export const createSkillSchema =
    skillFieldsSchema.extend({
        logo: imageFileSchema,
    });

export const updateSkillSchema =
    skillFieldsSchema.extend({
        logo: z.union([
            imageFileSchema,
            existingLogoSchema,
        ]),
    });

export type CreateSkillInput =
    z.infer<typeof createSkillSchema>;

export type UpdateSkillInput =
    z.infer<typeof updateSkillSchema>;