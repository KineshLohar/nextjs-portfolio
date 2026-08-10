import { z } from "zod";

const descriptionSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, "Description is required."),
});

export const workExperienceSchema = z
    .object({
        role: z
            .string()
            .trim()
            .min(1, "Role is required."),

        company: z
            .string()
            .trim()
            .min(1, "Company is required."),

        location: z
            .string()
            .trim(),

        techs: z
            .string()
            .trim()
            .min(1, "Technologies are required."),

        descriptions: z
            .array(descriptionSchema)
            .min(1, "At least one description is required."),

        startDate: z.date({
            error: "Start date is required.",
        }),

        currentlyWorking: z.boolean(),

        endDate: z.date().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.currentlyWorking && !data.endDate) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message: "End date is required.",
            });
        }

        if (
            data.endDate &&
            data.endDate < data.startDate
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endDate"],
                message:
                    "End date must be after the start date.",
            });
        }
    });

export type WorkExperienceInput =
    z.infer<typeof workExperienceSchema>;