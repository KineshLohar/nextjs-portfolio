
export type WorkExperienceType = {
    _id: string;
    role: string;
    company: string;
    location: string;
    techs: string;
    descriptions: {
        _id?: string;
        text: string;
    }[];
    currentlyWorking: boolean;
    startDate: string;
    endDate: string | null;
};
