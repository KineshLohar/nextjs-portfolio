import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
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
            allowedImageTypes.includes(
                file.type as (typeof allowedImageTypes)[number]
            ),
        "Only JPG, PNG, and WebP images are allowed."
    );

const thumbnailSchema = z.object({
    public_id: z.string(),
    url: z.string().url(),
});

export const eduCertSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required."),

    description: z
        .string()
        .trim(),

    type: z
        .string()
        .trim()
        .min(1, "Type is required."),

    thumbnail: imageFileSchema,

    startDate: z.date().nullable(),

    endDate: z.date().nullable(),

    link: z
        .string()
        .trim(),
});

export const deleteEduCertSchema = z.object({
    id: z
        .string()
        .trim()
        .min(1, "Education or certification ID is required."),
});

export const updateEduCertSchema = eduCertSchema.extend({
    id: z
        .string()
        .trim()
        .min(1, "Education or certification ID is required."),

    thumbnail: z.union([
        imageFileSchema,
        thumbnailSchema,
    ]),
});

export type CreateEduCertInput =
    z.infer<typeof eduCertSchema>;

export type UpdateEduCertInput =
    z.infer<typeof updateEduCertSchema>;