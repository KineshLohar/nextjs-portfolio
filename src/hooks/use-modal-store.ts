import type { ProjectDocument } from "@/models/ProjectsModel";
import type { ContactRequestType } from "@/types/contact.types";
import type { EduCertItem } from "@/types/education-certification.types";
import type { SkillData } from "@/types/skill.types";
import type { WorkExperienceType } from "@/types/work-experience.types";
import { create } from "zustand";

export type ModalType = 'addWorkExp' | 'editWorkExp' | 'deleteWorkExp' | 'addSkill' | 'editSkill' | 'deleteSkill' | "addEduOrCert" | 'editEduOrCert' | 'deleteEduOrCert' | 'addProject' | 'editProject' | 'deleteProject' | 'changeResume' | 'deleteContact'


interface ModalData {
    workExperienceData?: WorkExperienceType;
    skillData?: SkillData;
    eduAndCertData?: EduCertItem;
    projectData?: ProjectDocument;
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