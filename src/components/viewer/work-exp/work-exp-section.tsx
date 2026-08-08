// export const dynamic = 'force-dynamic';

import { Timeline } from "@/components/ui/timeline";
import { getWorkExperiences } from "@/lib/server-actions/work.server";

export async function WorkExpSection() {
    const workExpData = await getWorkExperiences();

    return (
        <div className="w-full">
            <Timeline
                data={JSON.stringify(workExpData)}
            />
        </div>
    )
}