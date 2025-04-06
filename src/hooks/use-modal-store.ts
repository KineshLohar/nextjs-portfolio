import { WorkExperienceTypes } from "@/types/types";
import { create } from "zustand";

export type ModalType = 'addWorkExp' | 'viewWorkExp' | 'editWorkExp' | 'deleteWorkExp' | 'addSkill'

interface ModalData {
    WorkExperienceData?: WorkExperienceTypes
}

interface UseModalProps {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
    data: ModalData | null
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