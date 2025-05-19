export const dynamic = 'force-dynamic';

import { Timeline } from "@/components/ui/timeline";
import { WorkExperience } from "@/models/WorkExpModel";
import { WorkExperienceTypes } from "@/types/types";

export async function WorkExpSection() {


    const workExpData: WorkExperienceTypes[] = await WorkExperience.find().sort({ startDate: -1 });

    return (
        <div className="w-full">
            <Timeline
                data={JSON.stringify(workExpData)}
            />
        </div>
    )
}