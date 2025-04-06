'use client'

import { useEffect, useState } from "react"
import { AddWorkExpModal } from "../modals/add-work-exp-modal"
import { AddSkillModal } from "../modals/add-skill-modal";


export const ModalProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true) }, [])

    if(!isMounted) return null;

    return (
        <>
            <AddWorkExpModal />
            <AddSkillModal />
        </>
    )
}
