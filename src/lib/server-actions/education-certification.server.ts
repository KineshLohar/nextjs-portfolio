import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import connectDB from "@/db/connectDB";
import EduCert from "@/models/EduCertModel";

import type { ServerResponse } from "@/types/action-response.types";
import type {
  EduCertCategory,
  EduCertItem,
  EducationCertificationsData,
} from "@/types/education-certification.types";

interface EduCertQueryResult {
  _id: unknown;

  title: string;

  description: string;

  type: EduCertCategory;

  startDate?: Date | null;

  endDate?: Date | null;

  link?: string | null;

  thumbnail?: {
    id?: string;
    url?: string;
  } | null;
}

function serializeEduCert(
  item: EduCertQueryResult
): EduCertItem {
  return {
    _id: String(item._id),

    title: item.title,

    description: item.description,

    type: item.type,

    startDate: item.startDate
      ? item.startDate.toISOString()
      : null,

    endDate: item.endDate
      ? item.endDate.toISOString()
      : null,

    link: item.link ?? null,

    thumbnail:
      item.thumbnail?.id && item.thumbnail?.url
        ? {
            id: item.thumbnail.id,
            url: item.thumbnail.url,
          }
        : null,
  };
}

export async function getEducationCertifications(): Promise<
  ServerResponse<EducationCertificationsData>
> {
  "use cache";

  cacheLife("max");
  cacheTag("education-certifications");

  try {
    await connectDB();

    const documents =
      await EduCert.find()
        .sort({ startDate: -1 })
        .lean<EduCertQueryResult[]>();

    const items = documents.map(serializeEduCert);

    const data: EducationCertificationsData = {
      education: [],
      achievements: [],
      professionalCertificates: [],
      institutionalCertificates: [],
      onlineCertificates: [],
      otherCertificates: [],
    };

    for (const item of items) {
      switch (item.type) {
        case "Education":
          data.education.push(item);
          break;

        case "Achievements":
          data.achievements.push(item);
          break;

        case "Professional Certificates":
          data.professionalCertificates.push(item);
          break;

        case "Institutional Certificates":
          data.institutionalCertificates.push(item);
          break;

        case "Online Certificates":
          data.onlineCertificates.push(item);
          break;

        case "Other Certificates":
          data.otherCertificates.push(item);
          break;
      }
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error(
      "[getEducationCertifications]",
      error
    );

    return {
      success: false,
      data: null,
      error: "Failed to load education and certifications.",
    };
  }
}