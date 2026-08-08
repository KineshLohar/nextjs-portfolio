
import { ProjectCard } from "@/components/viewer/projects/project-card";
import { domain } from "@/constants/constants";
import { getProjects } from "@/lib/server-actions/project.server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Kinesh Lohar Portfolio",
  description:
    "Explore a curated collection of projects by Kinesh Lohar, full-stack software developer specializing in Next.js, React, Node.js, and AI-powered solutions. Each project reflects his skills in building responsive, high-performance web applications.",
  keywords: [
    "Kinesh Lohar projects",
    "full-stack project showcase",
    "Next.js portfolio",
    "React developer work",
    "Node.js projects",
    "MongoDB web apps",
    "AI/ML development",
    "Web development portfolio",
    "TypeScript projects",
    "modern web design",
  ],
  alternates: {
    canonical: `${domain}/projects`,
  },
  openGraph: {
    title: "Kinesh Lohar | Project Showcase",
    description:
      "From concept to deployment, browse through Kinesh Lohar's professional portfolio including MERN stack and AI-integrated projects.",
    url: `${domain}/projects`,
    images: [
      {
        url: `${domain}/og-projects.png`, // update with real image
        width: 1200,
        height: 630,
        alt: "Projects by Kinesh Lohar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinesh Lohar | Projects",
    description:
      "Discover full-stack applications and AI-integrated solutions built by Kinesh Lohar using modern technologies like Next.js, React, and Node.js.",
    site: "@kineshlohar",
    creator: "@kineshlohar",
    images: [`${domain}/kineshlohar.jpg`],
  },
};

export default async function Projects() {

  const response = await getProjects();

  if (!response.success) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-200">
            Unable to load projects
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {response.error}
          </p>
        </div>
      </section>
    );
  }

  const projects = response.data;
  return (
    <div className="w-full min-h-screen py-36">
      <div className="w-full  pb-16 px-4 sm:pl-8 md:px-8 lg:px-10 transition-all duration-300">

        <h2 className="fade-up text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent max-w-4xl transition-all duration-300">
          From Concept to Code: My Project Journey
        </h2>
        <p className="fade-up text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm transition-all duration-300">
          A collection of projects that reflect my dedication to both craft and creativity.
        </p>
      </div>
      <div className="w-full font-lato px-4 md:px-8 gap-8 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {
          projects?.length > 0 &&
          projects?.map((proj) => (
            <ProjectCard
              key={proj?._id}
              project={proj}
            />
          ))
        }
      </div>
    </div>
  )
}