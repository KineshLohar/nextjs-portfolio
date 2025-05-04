'use client'

import { cn } from "@/lib/utils";
import Link from "next/link"
import { usePathname } from "next/navigation";

export const Navbutton = ({ route }: { route: { id: number; path: string; label: string } }) => {

    const pathname = usePathname();
    const isActive = pathname === route.path || pathname.includes(route.path);
    return (
        <Link key={route.id} href={route.path}
            className={cn("group relative opacity-60 hover:opacity-100 transition-opacity duration-200",
                isActive && "opacity-100"
            )}
        >
            {route.label}
            <span
                className={`absolute -bottom-1.5 h-[2px] bg-white transition-all duration-300 ease-in-out
                    ${isActive ? 'left-0 w-full' : 'left-1/2 w-0 group-hover:w-full group-hover:left-0'}
                `}
            />
        </Link>
    )
}