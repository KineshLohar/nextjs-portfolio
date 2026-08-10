import { z } from "zod";

export const contactSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required.")
        .max(100, "Full name is too long."),

    email: z
        .string()
        .trim()
        .email("Please enter a valid email."),

    message: z
        .string()
        .trim()
        .min(1, "Message is required.")
        .max(5000, "Message is too long."),
});

export type ContactInput =
    z.infer<typeof contactSchema>;