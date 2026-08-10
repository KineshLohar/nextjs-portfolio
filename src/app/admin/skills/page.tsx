import { OpenModalButton } from "@/components/open-modal-button";
import SkillsTable from "@/components/skills/skills-table";
import { getAdminSkills } from "@/lib/data/skills";

export default async function Skills() {

    const response = await getAdminSkills();

    if (!response.success || !response.data) {
        return (
            <div className="w-full p-4 text-center">
                Failed to load skills.
            </div>
        );
    }

    const skills = response.data;

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType='addSkill' label="Add Skill" />
            </div>
            <div className="h-full w-full">
                {
                    skills?.length < 1 ? (
                        <div>
                            Skills Not found!
                        </div>
                    )
                        :
                        <SkillsTable skillsList={skills} />
                }
            </div>
        </div>
    )
}