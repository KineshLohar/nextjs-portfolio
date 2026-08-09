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

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as AuthUser;

        if (!decoded?.id || !decoded?.email) {
            return null;
        }

        return {
            id: decoded.id,
            email: decoded.email,
        };
    } catch {
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