import { OpenModalButton } from "@/components/open-modal-button";
import SkillsTable from "@/components/skills/skills-table";
import connectDB from "@/db/connectDB";
import SkillModel from "@/models/SkillModel";
import { Skill } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

connectDB()

export default async function Skills() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login')

    const skills: Skill[] = await SkillModel.find();

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