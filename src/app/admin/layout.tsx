import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex flex-col space-y-2">
            <div className="w-full h-20 fixed p-2">
                <AdminNavbar />
            </div>
            <div className="w-full h-full mt-20 px-2">
                <div className=" hidden md:flex md:z-50 flex-col fixed h-full w-[200px] rounded overflow-clip">
                    <AdminSidebar />
                </div>

                <div className="md:pl-[200px] h-full ">
                    {children}
                </div>
            </div>
        </div>
    )
}