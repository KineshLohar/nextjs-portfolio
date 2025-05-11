/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/
'use client'
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";

import { Github, Instagram, Linkedin, X } from "@/lib/icons";
import Link from "next/link";
import { useRef, useState } from "react";
import { SocialType } from "../viewer/footer";
import { SocialMediaLabel } from "../viewer/socials/socials-card";

const socials: SocialType[] = [
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

const colorMap: Record<SocialMediaLabel, string> = {
    'Instagram': 'text-pink-500 opacity-80',
    'Github': 'text-white',
    'X (formely twitter)': 'text-white',
    'Linkedin': 'text-blue-600 opacity-80'
};

export const FloatingDock = ({
    desktopClassName,
}: {
    desktopClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={socials} className={desktopClassName} />
        </>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
}: {
    items: SocialType[];
    className?: string;
}) => {
    const mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto hidden h-16 items-end gap-4 md:gap-8 rounded-2xl bg-transparent px-4 pb-3 md:flex",
                className,
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.id} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    label,
    link,
    icon
}: {
    mouseX: MotionValue;
    label: SocialMediaLabel;
    link: string;
    icon: React.ElementType;
    id: number;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
    const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

    const widthTransformIcon = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const heightTransformIcon = useTransform(
        distance,
        [-150, 0, 150],
        [40, 80, 40],
    );

    const width = useSpring(widthTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const height = useSpring(heightTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const widthIcon = useSpring(widthTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });
    const heightIcon = useSpring(heightTransformIcon, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const [hovered, setHovered] = useState(false);

    const Icon = icon;

    return (
        <Link href={link}>
            <div className="flex items-center gap-1">
                <motion.div
                    ref={ref}
                    style={{ width, height }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative bg-neutral-900 flex aspect-square items-center justify-center rounded-full"
                >
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 2, x: "-50%" }}
                                className="absolute -top-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
                            >
                                {label}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        style={{ width: widthIcon, height: heightIcon }}
                        className="flex flex-col items-center justify-center"
                    >
                        <Icon className={`bg-transparent rounded-full 
                                        p-1 w-8 h-8 sm:w-9 sm:h-9
                                        ${colorMap[label]}
                                        `} />
                    </motion.div>
                </motion.div>
                {/* <motion.span
                    className="text-sm text-zinc-300 opacity-85 font-normal my-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: hovered ? 1 : 0.85, y: hovered ? -10 : 10 }}
                    transition={{ duration: 0.3 }}
                >
                    {label}
                </motion.span> */}
                {/* <span className=" text-zinc-300 text-sm sm:text-sm md:text-base opacity-85 font-normal">{label}</span> */}
            </div>
        </Link >
    );
}
