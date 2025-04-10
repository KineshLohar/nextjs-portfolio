'use client'

import { useEffect, useState } from "react"
import { AddWorkExpModal } from "../modals/add-work-exp-modal"
import { AddSkillModal } from "../modals/add-skill-modal";
import { DeleteSkillModal } from "../modals/delete-skill-modal";
import { EditSkillModal } from "../modals/edit-skill-modal";
import { DeleteWorkExperienceModal } from "../modals/delete-work-exp-modal";
import { EditWorkExpModal } from "../modals/edit-work-exp-modal";
import { AddEducationOrCertificationModal } from "../modals/add-edu-or-cert-modal";
import { DeleteEduOrCertModal } from "../modals/delete-edu-cert-modal";
import { EditEducationOrCertificationModal } from "../modals/edit-edu-or-cert-modal";


export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true) }, [])

    if(!isMounted) return null;

    return (
        <>
            <AddWorkExpModal />
            <AddSkillModal />
            <DeleteSkillModal />
            <EditSkillModal />
            <DeleteWorkExperienceModal />
            <EditWorkExpModal />
            <AddEducationOrCertificationModal />
            <DeleteEduOrCertModal />
            <EditEducationOrCertificationModal />
        </>
    )
}
