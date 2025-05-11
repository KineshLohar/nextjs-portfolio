import { ProjectCard } from "@/components/viewer/projects/project-card";
import connectDB from "@/db/connectDB"
import ProjectModel from "@/models/ProjectsModel"
import { ProjectType } from "@/types/types";

connectDB()
export default async function Projects() {

    const projects: ProjectType[] = await ProjectModel.find().limit(3).populate('techs', '_id skill logo').sort({ createdAt: -1 });

    return (
        <div className="w-full min-h-screen py-36">
            <div className="w-full  pb-16 px-4 sm:pl-8 md:px-8 lg:px-10 transition-all duration-300">
                <h2 className="text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent max-w-4xl transition-all duration-300">
                    From Concept to Code: My Project Journey
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm transition-all duration-300">
                    A collection of projects that reflect my dedication to both craft and creativity.
                </p>
            </div>
            <div className="w-full font-lato px-4 md:px-8 gap-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
                {
                    projects?.length > 0 &&
                    projects?.map((proj) => (
                        <ProjectCard
                            key={proj?._id}
                            project={proj}
                        />
                    ))
                }
            </div>
        </div>
    )
}