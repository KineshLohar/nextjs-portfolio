import { ActionTooltip } from "@/components/action-tooltip";
import Link from "next/link";
import { socials, SocialType } from "../footer";
import { SocialMediaLabel } from "./socials-card";
import { FadeUp } from "@/components/animations/fadeup-gsap";

const colorMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'text-pink-500 opacity-80',
    'Github': 'text-white',
    'X (formely twitter)': 'text-white',
    'Linkedin': 'text-blue-600 opacity-80'
};

export const Socials = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center px-4 pt-24 gap-6">
            <FadeUp delay={0.5} duration={0.5} yOffset={50}>
                <h3 className="text-center text-lg sm:text-2xl font-medium opacity-90 bg-gradient-to-b font-breeserif from-white to-zinc-300 bg-clip-text text-transparent">Stay updated with my latest projects and insights</h3>
            </FadeUp>
            <div className="flex items-center justify-center flex-wrap gap-4 font-lato">
                {
                    socials?.map((social: SocialType, index) => {
                        const Icon = social?.icon;

                        return (
                            <FadeUp delay={0.5 + index/5} key={social?.id} duration={0.5} yOffset={50}>
                                <ActionTooltip  side='top' label={social?.label}>
                                    <Link key={social?.id} href={social?.link} target="_blank" className="group flex items-center hover:scale-105 transition-all duration-100">
                                        <Icon
                                            className={`bg-transparent rounded-full 
                                        p-1 w-8 h-8 sm:w-9 sm:h-9
                                        ${colorMap[social?.label]}
                                        `}
                                        /> <span className=" text-zinc-300 text-sm sm:text-sm md:text-base opacity-85 font-normal">{social?.label}</span>
                                    </Link>
                                </ActionTooltip>
                            </FadeUp>
                        )
                    })
                }
            </div>

            {/* <FloatingDock /> */}
        </div>
    )
}