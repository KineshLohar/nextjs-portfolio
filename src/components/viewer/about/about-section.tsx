'use client'

import TextRise from "@/components/animations/TextRise"

export const AboutSection = () => {
    return (
        <div className="w-full min-h-screen pt-32 sm:pt-24 pb-20 sm:pb-16 px-4 flex flex-col justify-between items-stretch ">
            <TextRise>
                <h2 className=" w-full sm:mt-6 text-left text-2xl sm:text-3xl md:text-4xl font-bold font-breeserif italic pr-12 sm:pr-0 sm:pl-8 md:pl-16 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent transition-all duration-300">
                    A Bit About Me
                </h2>
            </TextRise>

            <div className=' text-right text-sm md:text-base sm:w-8/12 lg:w-7/12 place-self-end sm:pr-16 font-lato'>
                <TextRise>
                    <p>
                        I&apos;m Kinesh Lohar, a Full-Stack Web Developer with a focus on building scalable, high-performance SaaS and complex software applications. I thrive on delivering clean, efficient code, prioritizing customer satisfaction, and am capable of working both independently and as part of a collaborative team.
                    </p>
                </TextRise>
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-end sm:items-center gap-3 sm:gap-6 mt-2">
                    <TextRise>
                        <div className="flex flex-col items-center  justify-center border- border-white/70- px-8- sm:px-12- py-2 sm:py-3.5 ">
                            <div className="text-xl sm:text-2xl font-bold text-white/90">
                                2+
                            </div>
                            <div className="text-xs opacity-85">
                                Years of Experience
                            </div>
                        </div>
                    </TextRise>
                    <TextRise>
                        <div className="flex flex-col items-center  justify-center border- border-white/70- px-8- sm:px-12- py-2 sm:py-3.5 ">
                            <div className="text-xl sm:text-2xl font-bold text-white/90">
                                10+
                            </div>
                            <div className="text-xs opacity-85">
                                Projects Completed
                            </div>
                        </div>
                    </TextRise>
                </div>
            </div>
        </div>
    )
}