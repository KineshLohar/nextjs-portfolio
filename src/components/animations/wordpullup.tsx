"use client";
import clsx from "clsx";
import { motion } from "framer-motion";
import { JSX } from "react";

interface WordPullUpProps {
    as?: keyof JSX.IntrinsicElements,
    text?: string;
    className?: string;
}

export const WordPullUp: React.FC<WordPullUpProps> = ({
    as = 'div',
    text = "",
    className = "",
}) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    const Element = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div;

    return (
        <Element
            variants={container}
            initial="hidden"
            animate="show"
            className={clsx(
                "text-center font-display font-bold drop-shadow-sm",
                "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
                "tracking-[-0.02em]",
                "md:leading-[4rem] lg:leading-[4.5rem] xl:leading-[5rem]",
                className,
            )}
        >
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    variants={item}
                    style={{ display: "inline-block", paddingRight: "15px" }}
                >
                    {word === "" ? <span>&nbsp;</span> : word}
                </motion.span>
            ))}
        </Element>
    );
};
