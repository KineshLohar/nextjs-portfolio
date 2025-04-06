import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex flex-col">
            <div className="w-full h-16 fixed">
                <AdminNavbar />
            </div>
            <div className="w-full h-full mt-16">
                <div className=" hidden md:flex md:z-50 flex-col fixed h-full w-[200px]">
                    <AdminSidebar />
                </div>

                <div className="md:pl-[200px] h-full ">
                    {children}
                </div>
            </div>
        </div>
    )
}