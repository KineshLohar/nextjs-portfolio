export const dynamic = 'force-dynamic';

import { Separator } from "@/components/ui/separator";
import { domain } from "@/constants/constants";
import connectDB from "@/db/connectDB";
import EduCert from "@/models/EduCertModel";
import { EduCertType } from "@/types/types";
import { ExternalLink } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Education & Certifications | Kinesh Lohar",
    description: "Discover Kinesh Lohar’s academic background and professional certifications in software development, AI/ML, and web technologies.",
    alternates: {
      canonical: `${domain}/educations-certifications`,
    },
    openGraph: {
      title: "Education & Certifications | Kinesh Lohar",
      description:
        "Explore the educational qualifications and certifications of Kinesh Lohar including software engineering, AI/ML, and full-stack development credentials.",
      url: `${domain}/educations-certifications`,
      siteName: "Kinesh Lohar Portfolio",
      images: [
        {
          url: `${domain}/og-edu.png`, // create this OG image
          width: 1200,
          height: 630,
          alt: "Education and Certifications Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@kinesh_lohar",
      creator: "@kinesh_lohar",
      title: "Kinesh Lohar’s Education & Certifications",
      images:[`${domain}/kineshlohar.jpg`],
      description:
        "Check out Kinesh Lohar’s educational background and professional certifications in modern full-stack and AI/ML technologies.",
    },
    keywords: [
      "Kinesh Lohar education",
      "Kinesh Lohar certifications",
      "Full-stack developer certifications",
      "AI ML certifications",
      "Software engineering qualifications",
      "Professional development MERN stack",
      "Developer resume credentials",
      "Tech certifications portfolio",
    ],
  };

connectDB();

const CertCard = ({ label, data }: { label: string; data: EduCertType[] | [] }) => {

    if (!data?.length) return null;

    return (
        <div className="">
            <h3
                className="fade-up mx-auto text-lg italic md:text-2xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent transition-all duration-300"
            >
                {label}
            </h3>
            <div className="space-y-8 font-lato">
                {
                    data?.map((item) => (
                        <div key={item?._id} className="fade-up group flex items-center gap-4 px-3 py-4 sm:px-8 sm:py-6 border border-neutral-800 bg-zinc-950">
                            {
                                item?.thumbnail?.url &&
                                <div className="relative h-16 w-20 lg:h-20 lg:w-20">
                                    <Image
                                        src={item?.thumbnail?.url}
                                        fill
                                        alt={item?.title}
                                        className="object-contain"
                                    />
                                </div>
                            }
                            <div className="flex flex-col justify-center gap-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className=" font-semibold md:text-xl">{item?.title}</h4>
                                    {
                                        item?.link &&
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={item?.link}
                                        >
                                            <ExternalLink className="opacity-80 group-hover:opacity-100" />
                                        </Link>}
                                </div>
                                <p className="text-xs sm:text-sm text-zinc-400 font-medium">{item?.description}</p>
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default async function EducationsCertifications() {

    const eduList: EduCertType[] = await EduCert.find();

    const educations = eduList
        ?.filter(item => item?.type === "Education")
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const achievements = eduList?.filter(item => item?.type === "Achievements");
    const profCert = eduList?.filter(item => item?.type === "Professional Certificates");
    const instCert = eduList?.filter(item => item?.type === "Institutional Certificates");
    const onlineCert = eduList?.filter(item => item?.type === "Online Certificates");
    const other = eduList?.filter(item => item?.type === "Other Certificates");

    return (
        <div className="w-full min-h-screen pt-32 pb-16">
            <div className="w-full  pb-12 px-4 md:px-8 lg:px-10 transition-all duration-300 text-center">

                <h2 className="fade-up mx-auto text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent transition-all duration-300">
                    Learning Milestones
                </h2>
                <p className="fade-up mx-auto text-neutral-700 dark:text-neutral-300 text-sm md:text-base transition-all duration-300">
                    Degrees and certifications that define my professional path
                </p>
            </div>
            <Separator className="fade-up mx-auto min-h-1 mb-10 max-w-8/12 sm:max-w-7/12 md:max-w-6/12 lg:max-w-2/12 rounded-full transition-transform duration-200" />

            <div className="w-full  px-4 md:px-8 lg:px-28 space-y-10">
                <CertCard
                    label="Education"
                    data={educations}
                />
                <CertCard
                    label="Achievements"
                    data={achievements}
                />
                <CertCard
                    label="Professional Certificates"
                    data={profCert}
                />
                <CertCard
                    label="Institutional Certificates"
                    data={instCert}
                />
                <CertCard
                    label="Online Certificates"
                    data={onlineCert}
                />
                <CertCard
                    label="Other Certificates"
                    data={other}
                />
            </div>
        </div>
    )
}