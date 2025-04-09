import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const DeleteWorkExperienceModal = () => {

    const { onClose, isOpen, type, data } = useModal();
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const { WorkExperienceData } = data;
    const isModalOpen = isOpen && type === 'deleteWorkExp';

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/admin/work-exp/${WorkExperienceData?._id}`)
            router.refresh();
            onClose()
        } catch (error) {
            console.log("ERROR DELETING SKILL", error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader >
                    <DialogTitle>Delete Work Experience</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure? You want to delete the <span className=" font-bold">{WorkExperienceData?.role}, {WorkExperienceData?.company}, {WorkExperienceData?.location}</span>. This action cannot be undone!
                </DialogDescription>
                <DialogFooter>
                    <Button type="button" disabled={loading} variant='destructive' onClick={onDelete} className="cursor-pointer mt-4">
                        Delete {WorkExperienceData?.role} 
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}