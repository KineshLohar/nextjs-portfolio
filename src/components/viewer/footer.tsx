import { Github, Instagram, Linkedin, X } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";
import { SocialMediaLabel } from "./socials/socials-card";
import { ActionTooltip } from "../action-tooltip";
import { Separator } from "../ui/separator";

export interface SocialType {
    id: number;
    label: SocialMediaLabel;
    link: string;
    icon: React.ElementType
}

export const socials: SocialType[] = [
    {
        id: 1,
        label: 'Instagram',
        link: 'https://www.instagram.com/kinesh_malviya',
        icon: Instagram
    },
    {
        id: 2,
        label: 'Github',
        link: 'https://github.com/KineshLohar',
        icon: Github
    },
    {
        id: 3,
        label: 'X (formely twitter)',
        link: 'https://x.com/kinesh_lohar',
        icon: X
    },
    {
        id: 4,
        label: 'Linkedin',
        link: 'https://www.linkedin.com/in/kineshlohar',
        icon: Linkedin
    },
]

export const colorMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'text-rose-700',
    'Github': 'text-black',
    'X (formely twitter)': 'text-black',
    'Linkedin': 'text-indigo-600'
}


export const Footer = () => {
    return (
        <div className=" w-full flex flex-col justify-center mt-8">
            <div className="flex items-center justify-between px-4 sm:px-10 md:px-16 transition-all duration-300">
                <div className="relative h-16 w-16 sm:h-20 sm:w-24 cursor-pointer">
                    <Image
                        src='/kineshlohar.png'
                        alt="Kinesh Lohar"
                        fill
                        className=" object-contain"
                    />
                </div>
                <div className="flex items-center gap-4 mt-4">
                    {
                        socials?.map((social: SocialType) => {
                            const Icon = social?.icon;

                            return (
                                <ActionTooltip key={social?.id} side='top' label={social?.label}>
                                    <Link key={social?.id} href={social?.link} className="group">
                                        <Icon
                                            className={`bg-zinc-900 rounded-full 
                                            p-1 w-8 h-8 sm:w-9 sm:h-9 
                                            group-hover:scale-110 group-hover:mb-2 
                                            transition-all duration-100
                                            `}
                                        />
                                    </Link>
                                </ActionTooltip>
                            )
                        })
                    }
                </div>
            </div>
            <Separator className=" my-8 max-w-11/12 sm:max-w-9/12 mx-auto min-h-0.5" />
            <div className="text-center text-sm text-gray-500 mb-8">
                © {new Date().getFullYear()} Kinesh Lohar. All rights reserved.
            </div>
        </div>
    )
}