'use client'

import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle"

export const AdminNavbar = () => {

    const handleSignOut = async () => {
        try {

        } catch (error) {
            console.log("ERROR SIGN OUT", error);
            
        }
    }

    return (
        <div className="w-full h-full rounded flex items-center justify-between px-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div>
                Kinesh Lohar
            </div>
            <div className="ml-auto mr-2">
                <ModeToggle />
            </div>

            <Button
                // variant='ghost'
                className="bg-transparent shadow-none cursor-pointer text-black dark:text-white hover:bg-transparent"
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        </div>
    )
}