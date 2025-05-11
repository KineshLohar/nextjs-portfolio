import { ContactRequestType, EduCertType, ProjectType, Skill, WorkExperienceTypes } from "@/types/types";
import { create } from "zustand";

export type ModalType = 'addWorkExp' | 'editWorkExp' | 'deleteWorkExp' | 'addSkill' | 'editSkill' | 'deleteSkill' | "addEduOrCert" | 'editEduOrCert' | 'deleteEduOrCert' | 'addProject' | 'editProject' | 'deleteProject' | 'changeResume' | 'deleteContact'


interface ModalData {
    workExperienceData?: WorkExperienceTypes;
    skillData?: Skill;
    eduAndCertData?: EduCertType;
    projectData?: ProjectType;
    contactData?: ContactRequestType;
}

interface UseModalProps {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
    data: ModalData
}


export const useModal = create<UseModalProps>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({
        isOpen: true,
        type,
        data
    }),
    onClose: () => set({
        isOpen: false,
        type: null,
        data: {}
    })
}))