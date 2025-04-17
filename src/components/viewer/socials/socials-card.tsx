'use client'

import { Github, Instagram, Linkedin, X } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type SocialMediaLabel = 'Instagram' | 'Github' | 'X' | 'Linkedin';

const iconMap: Record<SocialMediaLabel, React.ReactElement> = {
    'Instagram': <Instagram className="w-9 h-9 text-white" />,
    'Github': <Github className="w-9 h-9 text-white" />,
    'X': <X className="w-9 h-9 text-white" />,
    'Linkedin': <Linkedin className="w-9 h-9 text-white" />
}

const descriptionMap: Record<SocialMediaLabel, string> = {
    'Instagram': "Behind the scenes & creative sparks!",
    'Github': "Code playground — explore my builds!",
    'X': "Sharing thoughts, updates & side quests!",
    'Linkedin': "Let's grow, connect, and collaborate!"
}

const profilePicMap: Record<SocialMediaLabel, string> = {
    'Instagram': '',
    'Github': '',
    'X': '',
    'Linkedin': ''
}

const linkMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'https://www.instagram.com/kinesh_malviya/',
    'Github': 'https://github.com/KineshLohar',
    'X': 'https://x.com/kinesh_lohar',
    'Linkedin': 'https://www.linkedin.com/in/kineshlohar/'
}

const usernameMap: Record<SocialMediaLabel, string> = {
    'Instagram': '@kinesh_malviya',
    'Github': '@KineshLohar',
    'X': '@kinesh_lohar',
    'Linkedin': '@kineshlohar'
}

const backgroundMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-500',
    'Github': 'bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-700',
    'X': 'bg-gradient-to-br from-blue-600 via-sky-800 to-blue-900',
    'Linkedin': 'bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800'
}

// Shimmering overlay colors for metallic effect
const overlayMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'from-rose-200 via-purple-300 to-indigo-200',
    'Github': 'from-neutral-300 via-zinc-400 to-neutral-300',
    'X': 'from-sky-300 via-blue-200 to-sky-300',
    'Linkedin': 'from-blue-200 via-indigo-300 to-blue-200'
}

// Accent colors for card details
const accentMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'from-amber-300 to-amber-500',
    'Github': 'from-slate-300 to-slate-400',
    'X': 'from-blue-300 to-blue-400',
    'Linkedin': 'from-indigo-300 to-indigo-400'
}

export const SocialsCard = ({ label }: { label: SocialMediaLabel }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


    // For the 3D tilting effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({
            x: (x / rect.width - 0.5) * 20, // Max 20 degree rotation
            y: (y / rect.height - 0.5) * -20 // Invert Y for correct tilt direction
        });
    };

    return (
        <Link
            id="#socialCard"
            href={linkMap[label]}
            target="_blank"
            rel="noopener noreferrer"
            className="block perspective-1000"
        >
            <div
                className={`
                    w-80 h-40 rounded-xl 
                    ${backgroundMap[label]}
                    shadow-2xl hover:shadow-2xl transition-all duration-500
                    cursor-pointer overflow-hidden relative
                    group
                    opacity-90
                    hover:opacity-100
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
                style={{
                    transform: isHovered ?
                        `rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)` :
                        'rotateY(0deg) rotateX(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {/* Holographic shimmer overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${overlayMap[label]} opacity-20 z-10 
                                group-hover:opacity-30 transition-opacity duration-300`}></div>

                {/* Embossed chip design - similar to credit card chip */}
                {/* <div className="absolute top-4 left-4 w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 
                              flex items-center justify-center z-20 shadow-md overflow-hidden">
                    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px">
                        <div className="bg-amber-600"></div>
                        <div className="bg-amber-500"></div>
                        <div className="bg-amber-500"></div>
                        <div className="bg-amber-600"></div>
                    </div>
                </div> */}

                {/* Platform icon - positioned like card logo */}
                <div className="absolute top-4 right-4 p-2 z-20">
                    {iconMap[label]}
                </div>

                {/* Embossed name - like the raised text on a credit card */}
                <div className="absolute top-6 left-4 z-20 flex items-center">
                    <div className="text-white text-lg font-bold tracking-wider">
                        {profilePicMap[label] ? (
                            <Image
                                src={profilePicMap[label]}
                                alt={usernameMap[label]}
                                width={36}
                                height={36}
                                className="rounded-full border-2 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 
                                     flex items-center justify-center border border-white border-opacity-40">
                                <span className="text-white text-xs font-bold">KL</span>
                            </div>
                        )}
                    </div>
                    <div className="text-white text-xl tracking-widest opacity-80 ml-2">
                        {usernameMap[label]}
                    </div>
                </div>

                {/* Profile image */}
                {/* <div className="absolute bottom-4 right-4 z-20">
                    {profilePicMap[label] ? (
                        <Image
                            src={profilePicMap[label]}
                            alt={usernameMap[label]}
                            width={36}
                            height={36}
                            className="rounded-full border-2 border-white shadow-lg"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-white bg-opacity-20 
                                     flex items-center justify-center border border-white border-opacity-40">
                            <span className="text-white text-xs font-bold">KL</span>
                        </div>
                    )}
                </div> */}

                {/* Description - like a security message on credit card */}
                <div className="absolute bottom-4 left-4 max-w-60 z-20">
                    <div className={`text-base text-white opacity-80 tracking-wide font-light italic`}>
                        {descriptionMap[label]}
                    </div>
                </div>

                {/* Decorative security elements */}
                {/* <div className="absolute top-8 left-1/2 w-28 h-6 -translate-x-1/2 
                              bg-black bg-opacity-5 blur-md rounded-full"></div> */}
                <div className="absolute bottom-20 right-2 w-20 h-1 bg-gradient-to-r 
                              from-white to-transparent opacity-30"></div>

                {/* Holographic circle - like a security hologram */}
                <div className="absolute bottom-14 right-4 w-6 h-6 rounded-full 
                              bg-gradient-to-br from-transparent via-white to-transparent 
                              opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
        </Link>
    );
};