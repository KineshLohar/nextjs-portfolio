import { ActionTooltip } from "@/components/action-tooltip";
import connectDB from "@/db/connectDB"
import { Github } from "@/lib/icons";
import { cn } from "@/lib/utils";
import ProjectModel from "@/models/ProjectsModel";
import { ProjectType } from "@/types/types";
import { Folder, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


connectDB();

export async function ProjectsSection() {
    const projects: ProjectType[] = await ProjectModel.find().limit(3).populate('techs', '_id skill logo').sort({ createdAt: -1 });

    return (
        <div className="w-full min-h-screen mb-16">
            <div className="max-w-7xl mx-auto md:pt-28 px-4 sm:pl-8 md:px-8 lg:px-10 transition-all duration-300">
                <h2 className="text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent max-w-4xl transition-all duration-300">
                    Proof of Work, Passion & Precision
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm transition-all duration-300">
                    Dive into projects that reflect my technical skills and dedication to continuous learning.
                </p>
            </div>
            <div className="w-full flex flex-col items-center justify-start mt-12 gap-6 lg:px-9">
                {
                    projects?.length === 0
                        ?
                        <p className=" text-xl mx-auto my-8">No projects Added Yet by Admin</p>
                        :
                        projects?.map((proj, index) => (
                            <div key={proj?._id || index} className={cn(`w-full flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 md:px-8 lg:px-10`,
                                index % 2 !== 0 && "md:flex-row-reverse"
                            )}>
                                {/* <div className="relative w-full md:w-5/12 h-full">
                                    <Image
                                        fill
                                        src={proj?.thumbnail?.url}
                                        alt={proj?.title}
                                        className="object-contain"
                                    />
                                </div> */}
                                <div className="relative w-full sm:w-6/12- md:w-6/12 lg:w-5/12 h-full">
                                    <Image
                                        src={proj?.thumbnail?.url}
                                        alt={proj?.title}
                                        width={400}
                                        height={250}
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                                <div className={cn(`w-full mt-4 font-lato sm:mt-8 md:mt-0 sm:w-6/12- md:w-6/12 lg:w-7/12 flex flex-col justify-center items-start`,
                                    index % 2 === 0 && 'sm:pl-8- md:pl-8 lg:p-16',
                                    index % 2 !== 0 && "md:pr-8"
                                )}>
                                    <h3 className="font-medium text-xl md:text-2xl lg:text-3xl tracking-wide font-breeserif capitalize">{proj?.title}</h3>
                                    <p className="text-sm text-zinc-200 mt-2">{proj?.description}</p>
                                    <div className=" flex gap-4 flex-wrap my-5">
                                        {
                                            proj?.techs?.length > 0
                                            &&
                                            proj?.techs?.map(tech => (
                                                <ActionTooltip key={tech?._id} label={tech?.skill} side="top">
                                                    <div className="relative w-6 h-6">
                                                        <Image
                                                            src={tech?.logo?.url}
                                                            alt={tech?.skill}
                                                            fill
                                                        />
                                                    </div>
                                                </ActionTooltip>
                                            )
                                            )
                                        }
                                    </div>
                                    {
                                        (!!proj?.repoLink || !!proj?.demoLink) &&
                                        <div className="flex items-center gap-3 text-xs sm:text-sm md:text-base" >
                                            {
                                                !!proj?.repoLink &&
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={proj?.repoLink} className="bg-gradient-to-r from-zinc-500/30 to-neutral-500/50 hover:scale-105  p-1 px-3  flex gap-2 items-center text-zinc-200 transition-all duration-200">
                                                    <Github className="rounded-full  h-7 w-7  " /> <span className="font-semibold font-lato">Repo</span>
                                                </Link>
                                            }
                                            {
                                                !!proj?.demoLink &&
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={proj?.demoLink} className="bg-gradient-to-r from-zinc-500/30 to-neutral-500/50 hover:scale-105  p-1 px-3  flex gap-2 items-center text-zinc-200  transition-all duration-200">
                                                    <Link2 className="rounded-full h-7 w-7 " /> <span className="font-semibold font-lato">Demo</span>
                                                </Link>
                                            }
                                        </div>}
                                </div>
                            </div>
                        ))
                }
            </div>
            <div className="w-full flex items-center justify-center mt-6 px-8">
                <Link
                    href="/projects"
                    className="capitalize relative group text-xs md:text-sm border hover:text-neutral-950 border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer overflow-hidden"
                >
                    <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
                    <span className="z-10 group-hover:text-neutral-950 flex gap-2 items-center"><Folder className="w-4 h-4" /> See All Creations</span>
                </Link>
            </div>
        </div>
    )
}