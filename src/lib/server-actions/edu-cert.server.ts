"use server";

import "server-only";

import { updateTag } from "next/cache";
import { z } from "zod";

import { withDb } from "@/db/db-helper";
import { requireAuth } from "@/lib/server-auth";
import EduCert from "@/models/EduCertModel";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import type { ServerResponse } from "@/types/action-response.types";
import { deleteEduCertSchema, eduCertSchema, updateEduCertSchema, type CreateEduCertInput, type UpdateEduCertInput } from "../validations/education-certification.validation";


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

        updateTag("education-certifications");

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

export async function updateEduCert(
    input: UpdateEduCertInput
): Promise<ServerResponse<null>> {
    try {
        await requireAuth();

        const parsed =
            updateEduCertSchema.safeParse(input);

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
            id,
            title,
            description,
            type,
            thumbnail,
            startDate,
            endDate,
            link,
        } = parsed.data;

        const result = await withDb(async () => {
            const eduCert =
                await EduCert.findById(id);

            if (!eduCert) {
                return {
                    success: false as const,
                    error:
                        "Education or certification not found.",
                };
            }

            const oldPublicId =
                eduCert.thumbnail?.public_id;

            let newThumbnail:
                | {
                    public_id: string;
                    url: string;
                }
                | undefined;

            if (thumbnail instanceof File) {
                const buffer = Buffer.from(
                    await thumbnail.arrayBuffer()
                );

                const uploadResult =
                    await uploadToCloudinary(
                        buffer,
                        thumbnail.type,
                        {
                            folder: "projects/edu-cert",
                        }
                    );

                newThumbnail = {
                    public_id:
                        uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }

            eduCert.title = title;
            eduCert.description = description;
            eduCert.type = type;
            eduCert.startDate = startDate;
            eduCert.endDate = endDate;
            eduCert.link = link;

            if (newThumbnail) {
                eduCert.thumbnail =
                    newThumbnail;
            }

            await eduCert.save();

            return {
                success: true as const,
                oldPublicId:
                    newThumbnail
                        ? oldPublicId
                        : null,
            };
        });

        if (!result.success) {
            return {
                success: false,
                data: null,
                error: result.error,
            };
        }

        if (result.oldPublicId) {
            try {
                await deleteFromCloudinary(
                    result.oldPublicId
                );
            } catch (error) {
                console.error(
                    "[updateEduCert] Failed to delete old thumbnail:",
                    error
                );
            }
        }

        updateTag("education-certifications");

        return {
            success: true,
            data: null,
            error: null,
        };
    } catch (error) {
        console.error(
            "[updateEduCert]",
            error
        );

        return {
            success: false,
            data: null,
            error:
                "Failed to update education or certification.",
        };
    }
}

export async function deleteEduCert(
    input: z.infer<typeof deleteEduCertSchema>
): Promise<ServerResponse<null>> {
    try {
        await requireAuth();

        const parsed =
            deleteEduCertSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                data: null,
                error:
                    parsed.error.issues[0]?.message ??
                    "Invalid education or certification ID.",
            };
        }

        const result = await withDb(async () => {
            const eduCert =
                await EduCert.findById(
                    parsed.data.id
                );

            if (!eduCert) {
                return {
                    success: false as const,
                    error:
                        "Education or certification not found.",
                };
            }

            const publicId =
                eduCert.thumbnail?.public_id;

            await EduCert.findByIdAndDelete(
                parsed.data.id
            );

            return {
                success: true as const,
                publicId,
            };
        });

        if (!result.success) {
            return {
                success: false,
                data: null,
                error: result.error,
            };
        }

        if (result.publicId) {
            try {
                await deleteFromCloudinary(
                    result.publicId
                );
            } catch (error) {
                console.error(
                    "[deleteEduCert] Failed to delete thumbnail:",
                    error
                );
            }
        }

        updateTag("education-certifications");

        return {
            success: true,
            data: null,
            error: null,
        };
    } catch (error) {
        console.error(
            "[deleteEduCert]",
            error
        );

        return {
            success: false,
            data: null,
            error:
                "Failed to delete education or certification.",
        };
    }
}