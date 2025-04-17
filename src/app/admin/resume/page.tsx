import { OpenModalButton } from "@/components/open-modal-button";
import PDFViewer from "@/components/PDFViewer";
import connectDB from "@/db/connectDB";
import ResumeModel from "@/models/ResumeModel";
import { ResumeType } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

connectDB();

export default async function Resume() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login');

    const resume: ResumeType | null = await ResumeModel.findOne({ resumeId: 1 });

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType='changeResume' label="Change Resume" />
            </div>
            <div className="min-h-screen w-full">
                {
                    !resume ? (
                        <div className="w-full items-center text-center p-2">
                            Resume Not found!
                        </div>
                    )
                        :
                        <div className="m-auto max-w-3xl flex items-center flex-col">
                            <h3 className=" font-semibold text-zinc-700 dark:text-zinc-500 text-center w-full my-4">{resume?.link}</h3>
                            <PDFViewer url={resume?.link} />
                        </div>
                }
            </div>
        </div>
    )
}