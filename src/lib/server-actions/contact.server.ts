"use server";

import "server-only";

import connectDB from "@/db/connectDB";
import ContactRequest from "@/models/ContactRequestModel";
import { sendMail } from "@/lib/send-mail";
import type { ServerResponse } from "@/types/action-response.types";
import {
    contactSchema,
    type ContactInput,
} from "@/lib/validations/contact.validation";
import { requireAuth } from "../server-auth";

export async function createContactRequest(
    input: ContactInput
) {
    try {
        const parsed =
            contactSchema.safeParse(input);

        if (!parsed.success) {
            return {
                success: false,
                data: null,
                error:
                    parsed.error.issues[0]?.message ??
                    "Invalid contact form data.",
            } satisfies ServerResponse<never>;
        }

        await connectDB();

        const {
            fullName,
            email,
            message,
        } = parsed.data;

        const contactRequest =
            await ContactRequest.create({
                fullName,
                email,
                message,
            });

        if (!contactRequest) {
            return {
                success: false,
                data: null,
                error:
                    "Unable to create contact request.",
            } satisfies ServerResponse<never>;
        }

        const emailSubject =
            `New Contact Request from ${fullName}`;

        const emailText = [
            "New Contact Request",
            "",
            `Name: ${fullName}`,
            `Email: ${email}`,
            "",
            "Message:",
            message,
        ].join("\n");

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Contact Request</h2>

                <p>
                    <strong>Name:</strong>
                    ${escapeHtml(fullName)}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHtml(email)}
                </p>

                <p>
                    <strong>Message:</strong>
                </p>

                <p>
                    ${escapeHtml(message).replace(/\n/g, "<br />")}
                </p>
            </div>
        `;

        await sendMail({
            email,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
        });

        return {
            success: true,
            data: null,
            error: null,
        } satisfies ServerResponse<null>;
    } catch (error) {
        console.error(
            "[createContactRequest]",
            error
        );

        return {
            success: false,
            data: null,
            error:
                "Failed to send your message. Please try again.",
        } satisfies ServerResponse<never>;
    }
}

export async function deleteContactRequest(
    id: string
) {
    try {
        await requireAuth();

        if (!id) {
            return {
                success: false,
                data: null,
                error:
                    "Contact request ID is required.",
            } satisfies ServerResponse<never>;
        }

        await connectDB();

        const contactRequest =
            await ContactRequest.findById(id);

        if (!contactRequest) {
            return {
                success: false,
                data: null,
                error:
                    "Contact request not found.",
            } satisfies ServerResponse<never>;
        }

        await ContactRequest.findByIdAndDelete(id);

        return {
            success: true,
            data: null,
            error: null,
        } satisfies ServerResponse<null>;
    } catch (error) {
        console.error(
            "[deleteContactRequest]",
            error
        );

        return {
            success: false,
            data: null,
            error:
                "Failed to delete contact request.",
        } satisfies ServerResponse<never>;
    }
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}