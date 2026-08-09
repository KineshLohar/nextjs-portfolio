// export const dynamic = 'force-dynamic';

import { Timeline } from "@/components/ui/timeline";
import { getWorkExperiences } from "@/lib/server-actions/work.server";

export async function WorkExpSection() {
    const response =
        await getWorkExperiences();

    if (!response.success || !response.data) {
        return null;
    }
    return (
        <div className="w-full">
            <Timeline
                data={response?.data}
            />
        </div>
    )
}