'use client';

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export const MobileMenu = ({ routes }: { routes: { id: number, path: string, label: string }[] }) => {

    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <Menu
                className="md:hidden w-7 h-7 cursor-pointer"
                data-open="false"  // Initial state is closed
                onClick={() => setOpenMenu(true)}
            />
            <div className={cn(` md:hidden fixed right-0 top-0 w-8/12 sm:w-6/12
             min-h-screen bg-zinc-900/70 translate-x-full transition duration-300
             p-4 flex flex-col`,
                openMenu && 'translate-x-0',
            )}>
                <X className="w-10 h-10 font-bold cursor-pointer hover:bg-white/10 rounded-full p-1.5" onClick={() => setOpenMenu(false)} />

                <div className="flex flex-col items-start mt-8 text-right w-full ml-2 font-medium space-y-6 font-serif">
                    {
                        routes?.map(route => (
                            <Link key={route?.id} href={route?.path} className="" onClick={() => setOpenMenu(false)}>
                                {route.label}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    )
}