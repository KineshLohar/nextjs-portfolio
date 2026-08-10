import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import connectDB from "@/db/connectDB";
import ContactRequest from "@/models/ContactRequestModel";

import type { ServerResponse } from "@/types/action-response.types";

export interface ContactRequestData {
    _id: string;
    fullName: string;
    email: string;
    message: string;
}

type ContactRequestQuery = {
    _id: unknown;
    fullName: string;
    email: string;
    message: string;
};

export async function getContactRequests(): Promise<
    ServerResponse<ContactRequestData[]>
> {
    "use cache";

    cacheLife("max");
    cacheTag("contact-requests");

    try {
        await connectDB();

        const requests =
            await ContactRequest.find()
                .sort({ createdAt: -1 })
                .lean<ContactRequestQuery[]>();

        const data: ContactRequestData[] =
            requests.map((request) => ({
                _id: String(request._id),
                fullName: request.fullName,
                email: request.email,
                message: request.message,
            }));

        return {
            success: true,
            data,
            error: null,
        };
    } catch (error) {
        console.error(
            "[getContactRequests]",
            error
        );

        return {
            success: false,
            data: null,
            error: "Failed to load contact requests.",
        };
    }
}