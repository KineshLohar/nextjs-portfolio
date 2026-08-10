import { OpenModalButton } from "@/components/open-modal-button";
import WorkExpTable from "@/components/work-exp/work-experience-table";
import { getWorkExperiences } from "@/lib/server-actions/work.server";

export default async function WorkExperience() {

    const response = await getWorkExperiences();

    if (!response.success) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-4">
                <p className="text-sm text-red-500">
                    {response.error}
                </p>
            </div>
        );
    }

    const { data } = response;

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType="addWorkExp" label="Add Work Exp" />
            </div>
            <div>
                {
                    data && data?.length < 1 ? (
                        <div>
                            Work Experiences Not found!
                        </div>
                    )
                        :
                        <WorkExpTable experienceList={data} />
                }

            </div>
        </div>
    )
}