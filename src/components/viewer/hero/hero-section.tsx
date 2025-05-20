
import { Paperclip } from "lucide-react";
import Link from "next/link";
import { ContactNavButton } from "./contact-nab";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

const TypewriterEffect = dynamic(() => import("@/components/viewer/hero/typewrite-effect").then((mod) => mod.TypewriterEffect))as ComponentType


export const HeroSection = () => {
    return (
        <div className="relative overflow-hidden w-full min-h-screen flex flex-col text-center items-center justify-center">
            <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                aria-hidden="true"
            >
                <source src="/background.mp4" type="video/mp4" />
                <source src="/background.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>

            <div className="z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-4 flex flex-col text-center items-center justify-center">
                <h1 className="fade-up text-3xl sm:text-4xl md:text-6xl font-extrabold font-eaglelake text-zinc-200">
                    <span className="text-2xl sm:text-3xl md:text-4xl">I&apos;m <br /></span>
                    KINESH{' '}
                    <span className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-aurora bg-clip-text text-transparent">
                        LOHAR
                    </span>
                </h1>

                <div className="fade-up mt-4">
                    <TypewriterEffect />
                </div>

                <div className="z-10 mt-4 gap-4 text-xs flex items-center">
                    <div className="fade-up uppercase relative group text-xs md:text-sm border hover:text-neutral-950 border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer overflow-hidden">
                        <Link href="/resume">
                            <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
                            <span className="z-10 group-hover:text-neutral-950 flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />Resume
                            </span>
                        </Link>
                    </div>

                    <div className="fade-up">
                        <ContactNavButton />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>

    );
};

// export const HeroSection1 = () => {

//     return (
//         <div className="relative overflow-hidden w-full min-h-screen flex flex-col text-center items-center justify-center">

//             {/* <div
//                 className="absolute inset-0 bg-center bg-cover opacity-70"
//                 style={{ backgroundImage: "url('/background.mp4')" }}
//                 aria-hidden="true"
//             /> */}

//             <video
//                 autoPlay
//                 loop
//                 muted
//                 className="absolute inset-0 w-full h-full object-cover opacity-70"
//                 aria-hidden="true"
//             >
//                 <source src="/background.mp4" type="video/mp4" />
//                 <source src="/background.webm" type="video/webm" />
//                 Your browser does not support the video tag.
//             </video>

//             <div className="z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-4 flex flex-col text-center items-center justify-center">
//                 <FadeUp delay={0} duration={1} yOffset={50}>
//                     <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-eaglelake text-zinc-200">
//                         <span className="text-2xl sm:text-3xl md:text-4xl ">I&apos;m <br className="" /></span>KINESH{" "}
//                         <span className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-aurora bg-clip-text text-transparent">
//                             LOHAR
//                         </span>
//                     </h1>
//                 </FadeUp>
//                 <FadeUp delay={0.5} duration={1} yOffset={50}>
//                     <TypewriterEffect />
//                 </FadeUp>
//                 <div className="z-10 mt-4 gap-4 text-xs flex items-center">
//                     <FadeUp delay={1} duration={1} yOffset={50}
//                         className="uppercase relative group text-xs md:text-sm border hover:text-neutral-950 border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer overflow-hidden"
//                     >
//                         <Link
//                             href="/resume"
//                         >
//                             <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
//                             <span className="z-10 group-hover:text-neutral-950 flex items-center gap-2"><Paperclip className="w-4 h-4" />Resume</span>
//                         </Link>
//                     </FadeUp>
//                     <FadeUp delay={1} duration={1} yOffset={50}>
//                         <ContactNavButton />
//                     </FadeUp>
//                 </div>
//             </div>
//             <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
//         </div>
//     );
// };



// export const HeroSection2 = () => {
//     return (
//         <div className="w-full min-h-screen flex flex-col items-stretch justify-between pl-2 pt-40 sm:px-16 sm:pt-44">
//             <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-eaglelake text-zinc-200 ">KINESH LOHAR</div>
//             <div className="mb-auto mt-2 sm:text-lg font-serif text-zinc-300 font-medium tracking-wider">Full Stack Developer</div>
//             <div className="mb-36 md:mb-32 place-self-end pr-6 sm:pr-12 gap-4 text-xs flex items-center">
//                 <Link href='/resume' className="relative group text-xs md:text-sm  border hover:text-neutral-950  border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer  overflow-hidden">
//                     <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
//                     <span className="z-10 group-hover:text-neutral-950">Resume</span>
//                 </Link>
//                 <Link href='/contact' className=" flex items-center text-xs tracking-wider border-none bg-transparent text-zinc-300 hover:text-white hover:bg-transparent cursor-pointer">
//                     Contact <ExternalLink className="ml-1 w-4 h-4" />
//                 </Link>
//             </div>
//         </div>
//     )
// }
