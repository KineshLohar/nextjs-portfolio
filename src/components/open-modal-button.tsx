'use client'
import { ModalType, useModal } from "@/hooks/use-modal-store"
import { Button } from "./ui/button"

export const OpenModalButton = ({ modelType, label }: { modelType: ModalType, label: string }) => {

    const { onOpen } = useModal()

    const onClick = () => {
        onOpen(modelType)
    }

    return (
        <Button
            className=" bg-zinc-700 text-white dark:bg-white dark:text-black  hover:bg-zinc-700/90 dark:hover:bg-white/90"
            // variant='ghost'
            onClick={onClick}
        >
            {label}
        </Button>
    )
}