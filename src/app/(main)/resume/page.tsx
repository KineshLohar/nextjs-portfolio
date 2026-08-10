
import PDFViewer from "@/components/PDFViewer";
import { domain } from "@/constants/constants";
import { getResume } from "@/lib/data/resume";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Kinesh Lohar",
  description: "View the resume of Kinesh Lohar, full-stack MERN developer and AI/ML enthusiast. Explore skills, experience, and technologies used.",
  alternates: {
    canonical: `${domain}/resume`,
  },
  openGraph: {
    title: "Resume | Kinesh Lohar",
    description:
      "Check out Kinesh Lohar's professional resume including technical skills, work experience, education, and certifications in full-stack development and AI/ML.",
    url: `${domain}/resume`,
    siteName: "Kinesh Lohar Portfolio",
    images: [
      {
        url: `${domain}/kineshlohar.jpg`, // optional: create a professional OG image
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
    images: [`${domain}/kineshlohar.jpg`],
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

  const response = await getResume();

  if (!response.success) {
    return (
      <main className="min-h-screen w-full pt-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-200">
            Unable to load resume
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {response.error}
          </p>
        </div>
      </main>
    );
  }

  if (!response.data) {
    return (
      <main className="min-h-screen w-full pt-40 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-200">
            Resume Not Found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            The resume is currently unavailable.
          </p>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen w-full pt-40">

      <div className="h-full mx-auto max-w-2xl flex items-center flex-col">
        <PDFViewer url={response.data?.link} />
      </div>

    </div>
  )
}