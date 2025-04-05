import { AdminSidebarItem } from "./admin-sidebar-item"

const routes = [
    {
        id:1,
        route: '/admin/work-experience',
        label: "Work Experience"
    },
    {
        id:2,
        route: '/admin/skills',
        label: "Skills"
    },
    {
        id:3,
        route: '/admin/edu-cert',
        label: "Educ and Cert"
    },
    {
        id:4,
        route: '/admin/projects',
        label: "Projects"
    },
    {
        id:5,
        route: '/admin/contact-requests',
        label: "Contact Requests"
    },
    {
        id:6,
        route: '/admin/resume',
        label: "Resume"
    },
]

export const AdminSidebar = () => {
    return (
        <div className="w-full h-full flex flex-col items-center drop-shadow-lg bg-white dark:bg-black/70 rounded">
            {
                routes.map((item) => (
                    <AdminSidebarItem key={item?.id} id={item.id} route={item.route} label={item.label}  />
                ))
            }
        </div>
    )
}