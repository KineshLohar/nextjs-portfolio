import PDFViewer from "@/components/PDFViewer";
import connectDB from "@/db/connectDB";
import ResumeModel from "@/models/ResumeModel";
import { ResumeType } from "@/types/types";
import { Metadata } from "next";

connectDB();

export const metadata: Metadata = {
    title: "Resume | Kinesh Lohar",
    description: "View the resume of Kinesh Lohar, full-stack MERN developer and AI/ML enthusiast. Explore skills, experience, and technologies used.",
    alternates: {
      canonical: "https://kineshlohar.vercel.app/resume",
    },
    openGraph: {
      title: "Resume | Kinesh Lohar",
      description:
        "Check out Kinesh Lohar's professional resume including technical skills, work experience, education, and certifications in full-stack development and AI/ML.",
      url: "https://kineshlohar.vercel.app/resume",
      siteName: "Kinesh Lohar Portfolio",
      images: [
        {
          url: "https://kineshlohar.vercel.app/kineshlohar.jpg", // optional: create a professional OG image
          width: 1200,
          height: 630,
          alt: "Kinesh Lohar Resume Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kinesh_lohar",
      creator: "@kinesh_lohar",
      title: "Kinesh Lohar | Full-Stack Developer Resume",
      images: ["https://kineshlohar.vercel.app/kineshlohar.jpg"],
      description:
        "Download or browse the resume of Kinesh Lohar, MERN-stack developer with AI/ML experience, project highlights, and tech skills.",
    },
    keywords: [
      "Kinesh Lohar resume",
      "Full-stack developer resume",
      "React developer resume",
      "Next.js resume",
      "MERN stack developer profile",
      "AI ML resume",
      "Tech resume India",
      "Software engineer resume",
      "Web developer experience",
      "DevOps resume skills",
    ],
  };
  

export default async function Resume() {

    const resume: ResumeType | null = await ResumeModel.findOne({ resumeId: 1 });

    return (
        <div className="min-h-screen w-full pt-40">

            {
                !resume ? (
                    <div className="w-full items-center text-center p-2">
                        Resume Not found!
                    </div>
                )
                    :
                    <div className="h-full mx-auto max-w-2xl flex items-center flex-col">
                        <PDFViewer url={resume?.link} />
                    </div>
            }
        </div>
    )
}