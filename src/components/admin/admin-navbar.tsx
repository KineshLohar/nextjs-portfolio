'use client'

import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle"

export const AdminNavbar = () => {

    const handleSignOut = async () => {
        try {

        } catch (error) {

        }
    }

    return (
        <div className="w-full h-full rounded flex items-center justify-between px-4 bg-white drop-shadow dark:bg-black/70 text-black dark:text-white">
            <div>
                Kinesh Lohar
            </div>
            <div className="ml-auto">
                <ModeToggle />
            </div>

            <Button
                // variant='ghost'
                className="bg-transparent cursor-pointer text-black dark:text-white hover:bg-transparent"
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        </div>
    )
}