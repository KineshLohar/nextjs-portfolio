'use client'
import { cn } from "@/lib/utils";
import { BookCheck, BriefcaseBusiness, FileUser, FolderKanban, GraduationCap, Mail } from "lucide-react";
import Link from "next/link"
import { usePathname } from "next/navigation";

type IconName = "BriefcaseBusiness" | "BookCheck" | "GraduationCap" | "FolderKanban" | "Mail" | "FileUser";

// Map the icon names to their corresponding JSX elements
const iconMap: Record<IconName, React.ReactElement> = {
    "BriefcaseBusiness": <BriefcaseBusiness className="w-5 h-5" />,
    "BookCheck": <BookCheck className="w-5 h-5" />,
    "GraduationCap": <GraduationCap className="w-5 h-5" />,
    "FolderKanban": <FolderKanban className="w-5 h-5" />,
    "Mail": <Mail className="w-5 h-5" />,
    "FileUser": <FileUser className="w-5 h-5" />
}

export const AdminSidebarItem = ({ route, label, id, icon }: {
    route: string;
    label: string;
    id: number;
    icon: keyof typeof iconMap;
}) => {

    const pathname = usePathname()

    return (
        <Link
            key={id}
            href={route}
            className={cn(
                "flex items-center gap-2 text-sm w-full px-4 py-2.5 rounded-md text-black dark:text-white hover:bg-gray-100 transition dark:hover:bg-zinc-700/60",
                pathname === route && "bg-gray-100 dark:bg-zinc-700/50"
            )}
        >
            {iconMap[icon]}
            {label}
        </Link>
    )
}