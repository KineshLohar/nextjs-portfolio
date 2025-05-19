import { ActionTooltip } from "@/components/action-tooltip"
import { FadeUp } from "@/components/animations/fadeup-gsap"
import { Button } from "@/components/ui/button"
import { Github } from "@/lib/icons"
import { ProjectType } from "@/types/types"
import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"



export const ProjectCard = ({ project }: { project: ProjectType }) => {
    return (
        <div className="relative space-y-4 p-4 sm:p-6 py-6 border border-neutral-900 flex flex-col items-stretch bg-neutral-950 border- border-neutral-800/90- overflow-hidden transition-all duration-100 ">
            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                <h3 className="z-20 top-4 left-4 text-xl font-medium font-serif tracking-wide text-zinc-200 capitalize">{project?.title}</h3>
            </FadeUp>
            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                <div className="relative w-full min-h-48 rounded-lg overflow-hidden ">
                    <Image
                        src={project?.thumbnail?.url}
                        alt={project?.thumbnail?.id}
                        fill
                        className=" object-cover opacity-90 transition-transform duration-700 hover:scale-110"
                    />
                </div>
            </FadeUp>
            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                <p className=" text-xs sm:text-sm text-zinc-200 capitalize">
                    {project?.description}
                </p>
            </FadeUp>
            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                <div className="flex items-center gap-3 flex-wrap mb-6">
                    {
                        project?.techs?.length > 0
                        &&
                        project?.techs?.map(tech => (
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
            </FadeUp>
            {(project?.demoLink || project?.repoLink)
                &&
                <div className="flex items-center gap-4 mt-auto ml-auto text-white ">
                    {
                        project?.demoLink &&
                        <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                            <Button
                                asChild
                                className="bg-purple-600/30 rounded-none hover:bg-purple-700/50 text-white flex-1 group relative overflow-hidden"
                            >
                                <Link href={project.demoLink} target="_blank">
                                    <span className="flex items-center justify-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span>Demo</span>
                                    </span>

                                </Link>
                            </Button>
                        </FadeUp>
                    }
                    {
                        project?.repoLink &&
                        <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                            <Button
                                asChild
                                variant="outline"
                                className="text-gray-300 rounded-none border-gray-700 hover:border-purple-500 hover:text-white flex-1 group relative overflow-hidden"
                            >
                                <Link href={project.repoLink} target="_blank">
                                    <span className="flex items-center justify-center gap-2">
                                        <Github className="h-4 w-4" />
                                        <span>Code</span>
                                    </span>
                                </Link>
                            </Button>
                        </FadeUp>
                    }
                </div>}
        </div >
    )
}