export type EduCertCategory =
  | "Education"
  | "Achievements"
  | "Professional Certificates"
  | "Institutional Certificates"
  | "Online Certificates"
  | "Other Certificates";

export interface EduCertItem {
  _id: string;

  title: string;

  description: string;

  type: EduCertCategory;

  startDate: string | null;

  endDate: string | null;

  link: string | null;

  thumbnail: {
    id: string;
    url: string;
  } | null;
}

export interface EducationCertificationsData {
  education: EduCertItem[];
  achievements: EduCertItem[];
  professionalCertificates: EduCertItem[];
  institutionalCertificates: EduCertItem[];
  onlineCertificates: EduCertItem[];
  otherCertificates: EduCertItem[];
}