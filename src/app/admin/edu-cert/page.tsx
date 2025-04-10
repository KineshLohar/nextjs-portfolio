import { OpenModalButton } from "@/components/open-modal-button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function EducationCertifications(){

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login')

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType='addEduOrCert' label="Add Edu or Cert" />
            </div>
            <div className="h-full w-full min-h-screen">
                
            </div>
        </div>
    )
}