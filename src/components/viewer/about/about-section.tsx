


export const AboutSection = () => {
    return (
        <div className="w-full min-h-screen pt-36 px-4 flex flex-col justify-between items-stretch text">
            <div className=" w-full text-left text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold sm:pl-16">
                ABOUT ME
            </div>
            <div className=' text-right text-sm md:text-base'>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque inventore rem atque voluptatibus! Ad, similique ipsam facere explicabo aut, in, reprehenderit dicta dolor nemo at sunt asperiores ab nam minima!</div>
                <div className="flex items-center">
                    <div className="flex flex-col items-center  justify-center ">
                        <div>
                            2+ Years
                        </div>
                        <div>
                            Years of Experience
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div>
                            10+
                        </div>
                        <div>
                            Projects Completed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}