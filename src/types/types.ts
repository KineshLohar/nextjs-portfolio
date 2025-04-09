

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
    skill: string;
    level: string;
    type: string;
}