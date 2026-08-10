import { OpenModalButton } from "@/components/open-modal-button";
import PDFViewer from "@/components/PDFViewer";
import { getResume } from "@/lib/data/resume";

export default async function Resume() {
    const response = await getResume();

    if (!response.success) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-4">
                <p className="text-sm text-red-500">
                    {response.error}
                </p>
            </div>
        );
    }

    const resume = response.data;

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton
                    modelType="changeResume"
                    label="Change Resume"
                />
            </div>

            <div className="min-h-screen w-full">
                {!resume ? (
                    <div className="w-full items-center text-center p-2">
                        Resume Not found!
                    </div>
                ) : (
                    <div className="m-auto max-w-3xl flex items-center flex-col">
                        <h3 className="font-semibold text-zinc-700 dark:text-zinc-500 text-center w-full my-4">
                            {resume.link}
                        </h3>

                        <PDFViewer url={resume.link} />
                    </div>
                )}
            </div>
        </div>
    );
}