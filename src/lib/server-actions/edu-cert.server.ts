"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { withDb } from "@/db/db-helper";
import { requireAuth } from "@/lib/server-auth";
import EduCert from "@/models/EduCertModel";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { ServerResponse } from "@/types/action-response.types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

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

    thumbnail: z
        .instanceof(File, {
            message: "Image is required.",
        })
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "Image size must be less than 5MB."
        )
        .refine(
            (file) =>
                allowedImageTypes.includes(
                    file.type as (typeof allowedImageTypes)[number]
                ),
            "Only JPG, PNG, and WebP images are allowed."
        ),

    startDate: z.date().nullable(),

    endDate: z.date().nullable(),

    link: z
        .string()
        .trim(),
});

export type CreateEduCertInput =
    z.infer<typeof eduCertSchema>;

export async function createEduCert(
    input: CreateEduCertInput
): Promise<ServerResponse<unknown>> {
    try {
        const user = await requireAuth();

        const parsed =
            eduCertSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                data: null,
                error:
                    parsed.error.issues[0]?.message ??
                    "Invalid education or certification data.",
            };
        }

        const {
            title,
            description,
            type,
            thumbnail,
            startDate,
            endDate,
            link,
        } = parsed.data;

        const imageBuffer = Buffer.from(
            await thumbnail.arrayBuffer()
        );

        const uploadResult =
            await uploadToCloudinary(
                imageBuffer,
                thumbnail.type,
                {
                    folder: "projects/edu-cert",
                }
            );

        const data = await withDb(async () => {
            const created = await EduCert.create({
                userId: user.id,
                title,
                description,
                type,
                thumbnail: {
                    public_id:
                        uploadResult.public_id,
                    url: uploadResult.secure_url,
                },
                startDate,
                endDate,
                link,
            });

            return created.toObject();
        });

        revalidateTag(
            "education-certifications",
            "max"
        );

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error) {
        console.error(
            "[createEduCert]",
            error
        );

        return {
            success: false,
            data: null,
            error:
                "Failed to create education or certification.",
        };
    }
}