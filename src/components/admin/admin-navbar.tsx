'use client'

import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle";
import { useTransition } from "react"
import { logout } from "@/lib/server-actions/auth.server"

export const AdminNavbar = () => {
    const [isLoggingOut, startTransition] = useTransition();

    const handleSignOut = () => {
        startTransition(async () => {
            await logout();
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