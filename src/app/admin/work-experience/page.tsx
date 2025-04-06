import { OpenModalButton } from "@/components/open-modal-button";
import WorkExpTable from "@/components/work-exp/work-experience-table";
import { WorkExperience as WorkExpModel } from "@/models/WorkExpModel";
import { WorkExperienceTypes } from "@/types/types";


export default async function WorkExperience() {

    const workExperiencs: WorkExperienceTypes[] = await WorkExpModel.find();

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType="addWorkExp" label="Add Work Exp" />
            </div>
            <div>
                {
                    workExperiencs?.length < 1 ? (
                        <div>
                            Work Experiences Not found!
                        </div>
                    ) 
                    :
                    <WorkExpTable experienceList={JSON.stringify(workExperiencs)} />
                }
                
            </div>
        </div>
    )
}