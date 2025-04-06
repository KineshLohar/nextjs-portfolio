import { OpenModalButton } from "@/components/open-modal-button";


export default function Skills(){
    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType='addSkill' label="Add Skill" />
            </div>
            <div>
                  
            </div>
        </div>
    )
}