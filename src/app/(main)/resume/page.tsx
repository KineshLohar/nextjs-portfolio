import PDFViewer from "@/components/PDFViewer";
import connectDB from "@/db/connectDB";
import ResumeModel from "@/models/ResumeModel";
import { ResumeType } from "@/types/types";

connectDB();

export default async function Resume() {

    const resume: ResumeType | null = await ResumeModel.findOne({ resumeId: 1 });

    return (
        <div className="min-h-screen w-full pt-40">

            {
                !resume ? (
                    <div className="w-full items-center text-center p-2">
                        Resume Not found!
                    </div>
                )
                    :
                    <div className="h-full mx-auto max-w-2xl flex items-center flex-col">
                        <PDFViewer url={resume?.link} />
                    </div>
            }
        </div>
    )
}