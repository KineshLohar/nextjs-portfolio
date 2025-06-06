import { ExternalLink, Paperclip } from "lucide-react";
import Link from "next/link";
import { ContactNavButton } from "./contact-nab";
import { TypewriterEffect } from "./typewrite-effect";


export const HeroSection2 = () => {
    return (
        <div className="w-full min-h-screen flex flex-col items-stretch justify-between pl-2 pt-40 sm:px-16 sm:pt-44">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-eaglelake text-zinc-200 ">KINESH LOHAR</div>
            <div className="mb-auto mt-2 sm:text-lg font-serif text-zinc-300 font-medium tracking-wider">Full Stack Developer</div>
            <div className="mb-36 md:mb-32 place-self-end pr-6 sm:pr-12 gap-4 text-xs flex items-center">
                <Link href='/resume' className="relative group text-xs md:text-sm  border hover:text-neutral-950  border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer  overflow-hidden">
                    <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
                    <span className="z-10 group-hover:text-neutral-950">Resume</span>
                </Link>
                <Link href='/contact' className=" flex items-center text-xs tracking-wider border-none bg-transparent text-zinc-300 hover:text-white hover:bg-transparent cursor-pointer">
                    Contact <ExternalLink className="ml-1 w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}

export const HeroSection = () => {


    return (
        <div className="relative overflow-hidden w-full min-h-screen flex flex-col text-center items-center justify-center">

            {/* Background image with opacity */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-70"
                style={{ backgroundImage: "url('/background.gif')" }}
                aria-hidden="true"
            ></div>

            {/* Content */}
            <div className="z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] px-4 flex flex-col text-center items-center justify-center">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-eaglelake text-zinc-200">
                    <span className="text-2xl sm:text-3xl md:text-4xl ">I&apos;m <br className="" /></span>KINESH{" "}
                    <span className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%_auto] animate-aurora bg-clip-text text-transparent">
                        LOHAR
                    </span>
                </h1>
                {/* <div className="mt-2 sm:text-xl font-serif text-zinc-300 font-medium tracking-widest">
                    Passionate <ContainerTextFlip textClassName="text-lg font-serif" className=" px-2 py-0" words={['Full Stack Developer', 'Lalit Gandu', 'Sunny Koladiya', 'Tejas Rathod']} />
                </div> */}
                <TypewriterEffect />
                <div className="z-10 mt-4 gap-4 text-xs flex items-center">
                    <Link
                        href="/resume"
                        scroll
                        className="uppercase relative group text-xs md:text-sm border hover:text-neutral-950 border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer overflow-hidden"
                    >
                        <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
                        <span className="z-10 group-hover:text-neutral-950 flex items-center gap-2"><Paperclip className="w-4 h-4" />Resume</span>
                    </Link>
                    <ContactNavButton />
                </div>
            </div>
            <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
    );
};