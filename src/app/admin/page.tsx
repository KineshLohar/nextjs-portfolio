import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Admin(){

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login')

    return redirect("/admin/work-experience")
}