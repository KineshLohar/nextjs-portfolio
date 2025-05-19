export const dynamic = 'force-dynamic';

import { FadeUp } from "@/components/animations/fadeup-gsap";
import Skill from "@/models/SkillModel";
import { Skill as SkillType } from "@/types/types";
import Image from "next/image";

interface SkillSectionType {
    type: string;
    skills: SkillType[] | []
}


export const SkillsSection = async () => {

    const data: SkillSectionType[] = await Skill.aggregate([
        {
            $group: {
                _id: '$type',
                skills: {
                    $push: {
                        _id: '$_id',
                        userId: '$userId',
                        skill: '$skill',
                        level: '$level',
                        experience: '$experience',
                        projects: '$projects',
                        logo: '$logo',
                        description: '$description',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                skills: 1
            }
        }
    ])

    return (
        <div className="w-full min-h-screen py-16 md:py-24 bg-black">
            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                <div className="relative max-w-7xl mx-auto px-4 sm:pl-8 md:px-8 lg:px-8 mb-12 transition-all duration-300">
                    <h2 className=" text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white  max-w-4xl transition-all duration-300">
                        <span className="text-3xl md:text-4xl tracking-wide italic font-breeserif ">
                            Tech Stack Arsenal
                        </span>
                    </h2>
                    <span className="absolute bottom-[-12px] w-32 md:w-72 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent animate-line-expand" />
                </div>
            </FadeUp>
            <div className="w-full px-4 md:px-8 max-w-7xl mx-auto grid gap-8 z-0">
                {data?.map((item, index) => (
                    <div
                        key={index}
                        className={`rounded-xl md:rounded-2xl
                            `}
                    >
                        <div className=" space-y-4">
                            <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                                <div className="flex items-center gap-3">
                                    <div className="h-[2px] w-6 font-lato md:w-8 bg-gradient-to-r from-rose-700 to-transparent" />
                                    <h4 className="font-medium md:font-semibold text-base md:text-xl text-zinc-300">
                                        {item?.type}
                                    </h4>
                                </div>
                            </FadeUp>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 overflow-visible">
                                {item?.skills?.map((skill, i) => (
                                    <FadeUp key={skill?._id} delay={0.7 + (i/10)} duration={0.5} yOffset={50}>
                                        <div
                                            key={skill?._id}
                                            className="group relative min-h-[100px] md:min-h-[120px] md:p-4 rounded-lg- border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors duration-200 overflow-visible"
                                        >
                                            {/* Skill Content */}
                                            <div className="flex flex-col items-center justify-center gap-2 md:gap-3 h-full">
                                                {skill?.logo?.url && (
                                                    <div className="relative h-8 w-8 md:h-10 md:w-10 flex-none">
                                                        <Image
                                                            src={skill?.logo?.url}
                                                            alt={skill?.skill}
                                                            fill
                                                            sizes="(max-width: 768px) 32px, 40px"
                                                            className="object-contain transition-all duration-300"
                                                        />
                                                    </div>
                                                )}
                                                <span className="text-xs md:text-sm font-medium text-zinc-300 text-center line-clamp-2 leading-tight">
                                                    {skill?.skill}
                                                </span>
                                            </div>

                                            {/* Hover Card */}
                                            {
                                                (!!skill?.projects || !!skill?.experience || !!skill?.description) &&
                                                <div className="absolute z-50 hidden group-hover:block bottom-full mb-2 left-0 right-0">
                                                    <div className="p-4 md:p-5 bg-zinc-900 border border-zinc-800 rounded-lgmd:rounded-xl shadow-xl backdrop-blur-sm">
                                                        <div className="space-y-2 md:space-y-3">
                                                            {skill?.experience
                                                                &&
                                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                                    <span className="text-xs md:text-sm text-zinc-400">Experience</span>
                                                                    <span className="text-xs md:text-sm text-zinc-200">{skill?.experience}</span>
                                                                </div>
                                                            }
                                                            {skill?.projects
                                                                &&
                                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                                    <span className="text-xs md:text-sm text-zinc-400">Projects</span>
                                                                    <span className="text-xs md:text-sm text-zinc-200">{skill?.projects}</span>
                                                                </div>}
                                                            {
                                                                skill?.description &&
                                                                <div className="pt-2 border-t border-zinc-800">
                                                                    <p className="text-xs text-zinc-400 line-clamp-3 md:line-clamp-4 leading-relaxed">
                                                                        {skill?.description}
                                                                    </p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>}
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )

    // return (
    //     <div className="w-full flex flex-col items-stretch px-4 py-24 bg-zinc-950">
    //         <h3 className="relative mx-auto mb-20 uppercase text-4xl md:text-5xl font-bold tracking-widest">
    //             <span className="bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
    //                 Tech Stack Arsenal
    //             </span>
    //             <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent animate-line-expand" />
    //         </h3>

    //         <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-8">
    //             {data?.map((item, index) => (
    //                 <div 
    //                     key={index}
    //                     className="relative rounded-2xl border border-zinc-800/30 bg-zinc-900/10 backdrop-blur-sm transition-all duration-500 hover:border-zinc-800/50"
    //                 >
    //                     <div className="absolute inset-0 -z-10 bg-[radial-gradient(200px_circle_at_var(--x)_var(--y),rgba(255,255,255,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    //                     <div className="p-8 space-y-6">
    //                         <div className="flex items-center gap-4">
    //                             <div className="h-[2px] w-8 bg-gradient-to-r from-rose-700 to-transparent" />
    //                             <h4 className="font-semibold text-xl text-zinc-300 tracking-wide">
    //                                 {item?.type}
    //                             </h4>
    //                         </div>

    //                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    //                             {item?.skills?.map(skill => (
    //                                 <div 
    //                                     key={skill?._id}
    //                                     className="group relative h-32 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-zinc-900/50"
    //                                 >
    //                                     <div className="flex flex-col items-center gap-4">
    //                                         {skill?.logo?.url && (
    //                                             <div className="relative h-12 w-12">
    //                                                 <Image 
    //                                                     src={skill?.logo?.url} 
    //                                                     alt={skill?.skill} 
    //                                                     fill 
    //                                                     className="object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
    //                                                 />
    //                                             </div>
    //                                         )}
    //                                         <span className="text-sm font-medium text-zinc-300">
    //                                             {skill?.skill}
    //                                         </span>
    //                                     </div>

    //                                     <div className="absolute z-[999] top-36 left-0 right-0 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl">
    //                                         <div className="space-y-3">
    //                                             <div className="flex justify-between items-center text-xs uppercase tracking-wide">
    //                                                 <span className="text-zinc-400">Experience</span>
    //                                                 <span className="text-zinc-200">{skill?.experience}</span>
    //                                             </div>
    //                                             <div className="flex justify-between items-center text-xs uppercase tracking-wide">
    //                                                 <span className="text-zinc-400">Projects</span>
    //                                                 <span className="text-zinc-200">{skill?.projects}</span>
    //                                             </div>
    //                                             <div className="pt-2 border-t border-zinc-800">
    //                                                 <p className="text-xs text-zinc-400 leading-relaxed">
    //                                                     {skill?.description}
    //                                                 </p>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // )
}