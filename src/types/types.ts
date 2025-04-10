

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
}

export interface EduCertType {
    _id: string;
    userId: string;
    title: string;
    description: string;
    type: string;
}