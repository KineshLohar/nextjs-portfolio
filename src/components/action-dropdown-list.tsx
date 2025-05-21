'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { Ellipsis, Eye, FilePenLine, Trash } from "lucide-react";

interface ActionDropdownListProps {
    data?: string;
    dataKey: string;
    viewModal?: ModalType;
    editModal?: ModalType;
    deleteModal?: ModalType;
}


export const ActionDropdownList = ({ data, dataKey, viewModal, editModal, deleteModal }: ActionDropdownListProps) => {

    const { onOpen } = useModal()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant='ghost' className="  hover:bg-zinc-300/30 dark:hover:bg-zinc-300/30">
                    <Ellipsis />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                    viewModal &&
                    <DropdownMenuItem onClick={() => onOpen(viewModal, { [dataKey]: data ? JSON.parse(data) : null })} className="">
                        <Eye /> View
                    </DropdownMenuItem>
                }
                {
                    editModal &&
                    <DropdownMenuItem onClick={() => onOpen(editModal, { [dataKey]: data ? JSON.parse(data) : null })} className="">
                        <FilePenLine /> Edit
                    </DropdownMenuItem>
                }
                {
                    deleteModal &&
                    <DropdownMenuItem onClick={() => onOpen(deleteModal, { [dataKey]: data ? JSON.parse(data) : null })} className="text-rose-400 ">
                        <Trash className="text-rose-400" /> Delete
                    </DropdownMenuItem>
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}