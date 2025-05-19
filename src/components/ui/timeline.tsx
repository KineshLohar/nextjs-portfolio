"use client";
import { WorkExperienceTypes } from "@/types/types";
import {
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { FadeUp } from "../animations/fadeup-gsap";

export const Timeline = ({ data }: { data: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const workExpData: WorkExperienceTypes[] = JSON.parse(data);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Format date to display as MMM YYYY (e.g. Jan 2023)
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="w-full bg-white dark:bg-black font-sans md:px-10 overflow-hidden min-h-screen"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:pl-8 md:px-8 lg:px-10 transition-all duration-300">
        <FadeUp delay={0.5} duration={0.5} yOffset={50}>
          <h2 className="text-2xl italic md:text-4xl mb-4 font-breeserif text-black dark:text-white max-w-4xl transition-all duration-300">
            The Road So Far
          </h2>
        </FadeUp>
        <FadeUp delay={0.7} duration={0.5} yOffset={50}>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm transition-all duration-300">
            A journey through my evolving career, from first steps to standout achievements.
          </p>
        </FadeUp>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto mt-8 pb-20">
        {workExpData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start justify-center md:justify-start md:items-start pt-10 md:gap-10"
          >
            {/* Left side - Role and Dates */}
            <FadeUp delay={0.7} duration={0.5} yOffset={50} className="z-40">
              <div className="sticky flex flex-col z-40 items-start top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                </div>
                <div className="md:pl-20 pl-16">
                  <h3 className="capitalize text-lg md:text-2xl font-bold text-black dark:text-white">
                    {item.role}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                    {formatDate(item.startDate)} - {item.currentlyWorking ? 'Present' : formatDate(item.endDate)}
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Right side - Company, Location, Techs, and Descriptions */}
            <div className="relative pl-16 mt-4 md:mt-0 md:pl-4 w-full pr-4 md:pr-10">
              <div className="pb-6">
                <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                  <h4 className="capitalize text-base md:text-xl font-semibold text-black dark:text-white transition-all duration-300">
                    {item.company} <br className="md:hidden" />• <span className="text-neutral-600 dark:text-neutral-400 font-normal">{item.location}</span>
                  </h4>
                </FadeUp>
                <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.techs.split(',').map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="capitalize px-3 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </FadeUp>
                <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    {item.descriptions.map((desc, descIndex) => (
                      <li
                        key={desc._id || descIndex}
                        className="text-neutral-700 text-xs md:text-sm dark:text-neutral-300 transition-all duration-300"
                      >
                        {desc.text}
                      </li>
                    ))}
                  </ul>
                </FadeUp>
              </div>
            </div>
          </div>
        ))}

        {/* Timeline line with animation */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div >
  );
};