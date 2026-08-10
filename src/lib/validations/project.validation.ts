import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

const imageFileSchema = z
    .instanceof(File, {
        message: "Image is required.",
    })
    .refine(
        (file) => file.size > 0,
        "Image cannot be empty."
    )
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Image must be less than 5MB."
    )
    .refine(
        (file) =>
            ALLOWED_IMAGE_TYPES.includes(
                file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
            ),
        "Only JPG, PNG, and WebP images are allowed."
    );

export const createProjectSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Project title is required."),

    description: z
        .string()
        .trim()
        .min(1, "Project description is required."),

    demoLink: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    repoLink: z
        .string()
        .trim()
        .optional()
        .or(z.literal("")),

    techs: z
        .array(z.string())
        .default([]),

    thumbnail: imageFileSchema,

    images: z
        .array(
            z.object({
                file: imageFileSchema,
                caption: z
                    .string()
                    .trim()
                    .min(1, "Image caption is required."),
            })
        )
        .default([]),
});

const existingImageSchema = z.object({
    public_id: z.string(),
    url: z.string().url(),
    caption: z.string().trim().min(1),
});

const newImageSchema = z.object({
    file: imageFileSchema,
    caption: z.string().trim().min(1),
});

export const updateProjectSchema =
    createProjectSchema.extend({
        id: z.string().min(1),

        thumbnail: z.union([
            imageFileSchema,
            z.object({
                id: z.string(),
                url: z.string().url(),
            }),
        ]),

        images: z.array(
            z.union([
                existingImageSchema,
                newImageSchema,
            ])
        ).default([]),
    });

export const deleteProjectSchema = z.object({
    id: z.string().min(1),
});

export type CreateProjectInput = z.infer<
    typeof createProjectSchema
>;

export type UpdateProjectInput =
    z.infer<typeof updateProjectSchema>;

export type DeleteProjectInput =
    z.infer<typeof deleteProjectSchema>;