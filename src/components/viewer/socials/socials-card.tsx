'use client'

import { Github, Instagram, Linkedin, X } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export type SocialMediaLabel = 'Instagram' | 'Github' | 'X (formely twitter)' | 'Linkedin';

const iconMap: Record<SocialMediaLabel, React.ReactElement> = {
    'Instagram': <Instagram className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />,
    'Github': <Github className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />,
    'X (formely twitter)': <X className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />,
    'Linkedin': <Linkedin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" />
}

const descriptionMap: Record<SocialMediaLabel, string> = {
    'Instagram': "Behind the scenes & creative sparks!",
    'Github': "Code playground — explore my builds!",
    'X (formely twitter)': "Sharing thoughts, updates & side quests!",
    'Linkedin': "Let's grow, connect, and collaborate!"
}

const profilePicMap: Record<SocialMediaLabel, string> = {
    'Instagram': '',
    'Github': '',
    'X (formely twitter)': '',
    'Linkedin': ''
}

const linkMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'https://www.instagram.com/kinesh_malviya/',
    'Github': 'https://github.com/KineshLohar',
    'X (formely twitter)': 'https://x.com/kinesh_lohar',
    'Linkedin': 'https://www.linkedin.com/in/kineshlohar/'
}

const usernameMap: Record<SocialMediaLabel, string> = {
    'Instagram': '@kinesh_malviya',
    'Github': '@KineshLohar',
    'X (formely twitter)': '@kinesh_lohar',
    'Linkedin': '@kineshlohar'
}

const backgroundMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-500',
    'Github': 'bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-700',
    'X (formely twitter)': 'bg-gradient-to-br from-blue-600 via-sky-800 to-blue-900',
    'Linkedin': 'bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800'
}

// Shimmering overlay colors for metallic effect
const overlayMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'from-rose-200 via-purple-300 to-indigo-200',
    'Github': 'from-neutral-300 via-zinc-400 to-neutral-300',
    'X (formely twitter)': 'from-sky-300 via-blue-200 to-sky-300',
    'Linkedin': 'from-blue-200 via-indigo-300 to-blue-200'
}

export const SocialsCard = ({ label }: { label: SocialMediaLabel }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile or has touch screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // For the 3D tilting effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return; // Disable tilt effect on mobile
        
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
            href={linkMap[label]}
            target="_blank"
            rel="noopener noreferrer"
            className="perspective-1000 h-full flex items-center"
        >
            <div
                className={`
                    w-full h-auto min-h-28 sm:min-h-32 md:min-h-36 lg:min-h-40
                    max-w-full sm:max-w-64 md:max-w-72 lg:max-w-80
                    aspect-[2/1] rounded-lg sm:rounded-xl 
                    ${backgroundMap[label]}
                    hover:shadow-2xl transition-all duration-500
                    cursor-pointer overflow-hidden relative
                    group
                    shadow-lg shadow-white/10 backdrop-blur-md
                    opacity-100
                    hover:opacity-95
                `}
                onMouseEnter={() => !isMobile && setIsHovered(true)}
                onMouseLeave={() => !isMobile && setIsHovered(false)}
                onMouseMove={handleMouseMove}
                style={{
                    transform: isHovered && !isMobile ?
                        `rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)` :
                        'rotateY(0deg) rotateX(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.2s ease-out'
                }}
            >
                {/* Holographic shimmer overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${overlayMap[label]} opacity-20 z-10 
                                group-hover:opacity-30 transition-opacity duration-300`}></div>

                {/* Platform icon */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1 sm:p-2 z-20">
                    {iconMap[label]}
                </div>

                {/* Profile and username */}
                <div className="absolute top-2 sm:top-4 md:top-6 left-2 sm:left-3 md:left-4 z-20 flex items-center">
                    <div className="flex-shrink-0">
                        {profilePicMap[label] ? (
                            <Image
                                src={profilePicMap[label]}
                                alt={usernameMap[label]}
                                width={36}
                                height={36}
                                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full border border-white sm:border-2 shadow-lg"
                            />
                        ) : (
                            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-full bg-white bg-opacity-20 
                                     flex items-center justify-center border border-white border-opacity-40">
                                <span className="text-white text-xs font-bold">KL</span>
                            </div>
                        )}
                    </div>
                    <div className="text-white text-sm sm:text-base md:text-lg lg:text-xl tracking-wide sm:tracking-wider opacity-80 ml-1">
                        <span className="inline">{usernameMap[label]}</span>
                        {/* <span className="xs:hidden">{label}</span> */}
                    </div>
                </div>

                {/* Description */}
                <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 max-w-full pr-4 z-20">
                    <div className="text-xs sm:text-sm md:text-base text-white opacity-80 tracking-wide font-light italic line-clamp-2">
                        {descriptionMap[label]}
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-16 sm:bottom-20 right-2 w-12 sm:w-16 md:w-20 h-px sm:h-1 bg-gradient-to-r 
                              from-white to-transparent opacity-30"></div>

                {/* Holographic circle */}
                <div className="absolute bottom-10 sm:bottom-12 md:bottom-14 right-2 sm:right-3 md:right-4 
                              w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full 
                              bg-gradient-to-br from-transparent via-white to-transparent 
                              opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
        </Link>
    );
};