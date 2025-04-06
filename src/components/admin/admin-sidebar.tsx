import { AdminSidebarItem } from "./admin-sidebar-item"

type IconName = "BriefcaseBusiness" | "BookCheck" | "GraduationCap" | "FolderKanban" | "Mail" | "FileUser";

const routes: { id: number; route: string; label: string; icon: IconName }[] = [
    {
        id:1,
        route: '/admin/work-experience',
        label: "Work Experience",
        icon: "BriefcaseBusiness"
    },
    {
        id:2,
        route: '/admin/skills',
        label: "Skills",
        icon: "BookCheck"
    },
    {
        id:3,
        route: '/admin/edu-cert',
        label: "Educ and Cert",
        icon: "GraduationCap"
    },
    {
        id:4,
        route: '/admin/projects',
        label: "Projects",
        icon: "FolderKanban"
    },
    {
        id:5,
        route: '/admin/contact-requests',
        label: "Contact Requests",
        icon: "Mail"
    },
    {
        id:6,
        route: '/admin/resume',
        label: "Resume",
        icon: "FileUser"
    },
]

export const AdminSidebar = () => {
    return (
        <div className="w-full h-full gap-1 p-2 flex flex-col border-r items-center drop-shadow bg-white dark:bg-zinc-900/70 ">
            {
                routes.map((item) => (
                    <AdminSidebarItem key={item?.id} id={item.id} route={item.route} label={item.label} icon={item.icon}  />
                ))
            }
        </div>
    )
}