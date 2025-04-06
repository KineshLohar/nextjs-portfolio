

export interface WorkExperienceTypes {
    _id: string;
    userId: string;
    role: string;
    company: string;
    location: string;
    techs: string;
    description: string[];
    currentlyWorking: boolean;
    startDate: Date;
    endDate: Date;
}