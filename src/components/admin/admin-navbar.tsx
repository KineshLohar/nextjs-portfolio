'use client'

import axios from "axios"
import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { logout } from "@/lib/server-actions/auth.server"

export const AdminNavbar = () => {
    const router = useRouter();
    const [isLoggingOut, startLogout] = useTransition();

    const handleSignOut = () => {
        startLogout(async () => {
            const response = await logout();

            if (!response.success) {
                console.error(
                    "[AdminNavbar] Logout failed:",
                    response.error
                );

                return;
            }

            router.replace("/login");
            router.refresh();
        });
    };

    return (
        <div className="w-full h-full rounded flex items-center justify-between px-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div>
                Kinesh Lohar
            </div>
            <div className="ml-auto mr-2">
                <ModeToggle />
            </div>

            <Button
                type="button"
                disabled={isLoggingOut}
                className="bg-transparent text-black shadow-none hover:bg-transparent dark:text-white"
                onClick={handleSignOut}
            >
                {isLoggingOut
                    ? "Signing Out..."
                    : "Sign Out"}
            </Button>
        </div>
    )
}