import { Button } from "@/components/ui/button"
import { WavyBackground } from "@/components/ui/wavy-background"


export const CTA = () => {
    return (
        <div className="relative w-full p-4 md:p-8 lg:p-20 overflow-hidden  ">
            <div className="absolute inset-0 bg-starfield " />
            <div className="absolute inset-0 z-20 shadow-[inset_0px_0px_40px_10px_#000000]" />
            <div
                className={`
                absolute inset-0
                bg-[linear-gradient(90deg,rgba(256,256,256,0.1),rgba(121,40,202,0.4),rgba(0,0,0,0.6))]
                bg-[length:100%_100%]
                blur-3xl opacity-70
                animate-aurora
                `}
            />

            <div
                className={` relative 
                 px-4 py-8 sm:p-10 sm:py-16 lg:p-16 border-2 border-white/40 rounded-2xl 
                 transition-all duration-300
                 overflow-hidden
                 shadow-white shadow-[0px_0px_20px_-10px_#bababa]
                 `}
            >
                <WavyBackground containerClassName=" overflow-hidden w-full" className="z-30 w-full flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-between">


                    <div className="font-bold text-lg lg:text-3xl text-center sm:text-left z-30">
                        Your ideas deserve attention, <br className="hidden sm:block" />
                        let's connect!
                    </div>

                    <Button type="button" className="relative group text-sm md:text-base font-bold border-2 border-white bg-transparent  px-6 py-3 md:py-5 rounded-full cursor-pointer z-50 hover:bg-transparent overflow-hidden">
                        <div className="-z-10 absolute h-16 w-80 bg-white -translate-x-96 group-hover:translate-x-0 transition-all duration-500 rounded-full opacity-90" />
                        <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Start Conversation!</span>
                    </Button>

                </WavyBackground>
            </div>

        </div>
    )
}