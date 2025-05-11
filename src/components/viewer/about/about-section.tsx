
export const AboutSection = () => {
    return (
        <div className="w-full min-h-screen pt-30 pb-16 px-4 flex flex-col justify-between items-stretch ">
            <h2 className=" w-full mt-6 text-left text-2xl sm:text-3xl md:text-4xl font-bold font-breeserif italic pr-12 sm:pr-0 sm:pl-8 md:pl-16 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent transition-all duration-300">
                A Bit About Me
            </h2>
            <div className=' text-right text-xs sm:text-sm md:text-base sm:w-8/12 lg:w-6/12 place-self-end sm:pr-16 font-lato'>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque inventore rem atque voluptatibus! Ad, similique ipsam facere explicabo aut, in, reprehenderit dicta dolor nemo at sunt asperiores ab nam minima!</p>
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-end sm:items-center gap-6 mt-2">
                    <div className="flex flex-col items-center  justify-center border- border-white/70- px-8- sm:px-12- py-2 sm:py-3.5 ">
                        <div className="text-xl sm:text-2xl font-bold text-white/90">
                            2+
                        </div>
                        <div className="text-xs opacity-85">
                            Years of Experience
                        </div>
                    </div>
                    <div className="flex flex-col items-center  justify-center border- border-white/70- px-8- sm:px-12- py-2 sm:py-3.5 ">
                        <div className="text-xl sm:text-2xl font-bold text-white/90">
                            10+
                        </div>
                        <div className="text-xs opacity-85">
                            Projects Completed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}