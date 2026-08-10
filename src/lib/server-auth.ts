// src/lib/server-auth.ts
"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export interface AuthUser {
    id: string;
    email: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("[AUTH] token:", token ? "EXISTS" : "MISSING");
    console.log(
        "[AUTH] secret:",
        process.env.TOKEN_SECRET ? "EXISTS" : "MISSING"
    );

    if (!token) {
        return null;
    }

    const secret = process.env.TOKEN_SECRET;

    if (!secret) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, secret);

        console.log("[AUTH] JWT VERIFIED", decoded);

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("id" in decoded) ||
            !("email" in decoded)
        ) {
            console.log("[AUTH] INVALID PAYLOAD");
            return null;
        }

        return {
            id: String(decoded.id),
            email: String(decoded.email),
        };
    } catch (error) {
        console.error("[AUTH] JWT FAILED", error);
        return null;
    }
}

export async function requireAuth(): Promise<AuthUser> {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}