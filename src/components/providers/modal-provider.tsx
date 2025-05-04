'use client'

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'

// Dynamically import each modal using named exports + ssr: false
const AddWorkExpModal = dynamic(() => import('../modals/add-work-exp-modal').then(mod => mod.AddWorkExpModal), { ssr: false });
const AddSkillModal = dynamic(() => import('../modals/add-skill-modal').then(mod => mod.AddSkillModal), { ssr: false });
const DeleteSkillModal = dynamic(() => import('../modals/delete-skill-modal').then(mod => mod.DeleteSkillModal), { ssr: false });
const EditSkillModal = dynamic(() => import('../modals/edit-skill-modal').then(mod => mod.EditSkillModal), { ssr: false });
const DeleteWorkExperienceModal = dynamic(() => import('../modals/delete-work-exp-modal').then(mod => mod.DeleteWorkExperienceModal), { ssr: false });
const EditWorkExpModal = dynamic(() => import('../modals/edit-work-exp-modal').then(mod => mod.EditWorkExpModal), { ssr: false });
const AddEducationOrCertificationModal = dynamic(() => import('../modals/add-edu-or-cert-modal').then(mod => mod.AddEducationOrCertificationModal), { ssr: false });
const DeleteEduOrCertModal = dynamic(() => import('../modals/delete-edu-cert-modal').then(mod => mod.DeleteEduOrCertModal), { ssr: false });
const EditEducationOrCertificationModal = dynamic(() => import('../modals/edit-edu-or-cert-modal').then(mod => mod.EditEducationOrCertificationModal), { ssr: false });
const AddProjectModal = dynamic(() => import('../modals/add-project-modal').then(mod => mod.AddProjectModal), { ssr: false });
const DeleteProjectModal = dynamic(() => import('../modals/delete-project-modal').then(mod => mod.DeleteProjectModal), { ssr: false });
const EditProjectModal = dynamic(() => import('../modals/edit-project-modal').then(mod => mod.EditProjectModal), { ssr: false });
const ChangeResumeModal = dynamic(() => import('../modals/change-resume-modal').then(mod => mod.ChangeResumeModal), { ssr: false });


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
            <AddProjectModal />
            <DeleteProjectModal />
            <EditProjectModal />
            <ChangeResumeModal />
        </>
    )
}
