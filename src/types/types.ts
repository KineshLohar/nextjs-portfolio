

export interface WorkExperienceTypes {
    _id: string;
    userId: string;
    role: string;
    company: string;
    location: string;
    techs: string;
    descriptions: { text: string }[];
    currentlyWorking: boolean;
    startDate: Date;
    endDate: Date;
}

export interface Skill {
    _id: string;
    userId: string;
    skill: string;
    level: string;
    type: string;
    experience: string;
    projects: string;
    description: string;
}

export interface EduCertType {
    _id: string;
    userId: string;
    title: string;
    description: string;
    type: string;
}

export interface ContactRequestType {
    _id: string;
    fullName: string;
    email: string;
    description: string;
}

export interface ProjectType {
    _id: string;
    title: string;
    description: string;
    demoLink: string;
    repoLink: string;
    techs: string;
    thumbnail: {
        id: string;
        url: string;
    },
    images: {
        _id: string;
        public_id: string;
        url: string;
        caption: string;
    }[]
}

export interface ResumeType {
    resumeId: number;
    link: string;
}