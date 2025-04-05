import Link from "next/link"

export const AdminSidebarItem = ({ route, label, id }: {
    route: string;
    label: string;
    id: number;
}) => {


    return (
        <Link
            key={id}
            href={route}
            className="w-full text-center py-3 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
            {label}
        </Link>
    )
}