'use client'

import axios from "axios"
import { Button } from "../ui/button"
import { ModeToggle } from "../ui/mode-toggle"
import { useRouter } from "next/navigation"

export const AdminNavbar = () => {

    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await axios.get("/api/logout");
            router.push("/login");
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
                className="bg-transparent shadow-none  text-black dark:text-white hover:bg-transparent"
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
        </div>
    )
}