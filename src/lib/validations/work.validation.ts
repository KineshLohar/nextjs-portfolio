import z from "zod";


export const workExperienceSchema = z.object({
    role: z
        .string()
        .trim()
        .min(1, "Role is required"),

    company: z
        .string()
        .trim()
        .min(1, "Company is required"),

    location: z
        .string()
        .trim(),

    techs: z
        .string()
        .trim()
        .min(1, "Technologies are required"),

    descriptions: z
        .array(
            z.object({
                text: z
                    .string()
                    .trim()
                    .min(
                        1,
                        "Description is required"
                    ),
            })
        )
        .min(
            1,
            "At least one description is required"
        ),

    startDate: z.date(),

    currentlyWorking: z.boolean(),

    endDate: z.date(),
}).superRefine((data, ctx) => {
    if (!data.currentlyWorking && data.endDate < data.startDate) {
        ctx.addIssue({
            code: "custom",
            path: ["endDate"],
            message:
                "End date must be after start date",
        });
    }
});