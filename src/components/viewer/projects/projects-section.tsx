import connectDB from "@/db/connectDB"
import ProjectModel from "@/models/ProjectsModel";


connectDB();

export async function ProjectsSection() {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });

    // console.log("PROJECTS ", projects);

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto md:pt-28 px-4 sm:pl-8 md:px-8 lg:px-10 transition-all duration-300">
                <h2 className="text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent max-w-4xl transition-all duration-300">
                    Proof of Work, Passion & Precision
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm transition-all duration-300">
                    Dive into projects that reflect my technical skills and dedication to continuous learning.
                </p>
            </div>
        </div>
    )
}