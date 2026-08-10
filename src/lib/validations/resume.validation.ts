import z from "zod";

export const updateResumeSchema = z.object({
    link: z
        .string()
        .trim()
        .min(1, "Resume link is required.")
        .url("Enter a valid resume URL."),
});

export type UpdateResumeInput = z.infer<
    typeof updateResumeSchema
>;