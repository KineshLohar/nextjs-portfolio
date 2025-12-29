import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const DeleteSkillModal = () => {

    const { onClose, isOpen, type, data } = useModal();
    const skillData = data?.skillData;
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const isModalOpen = isOpen && type === 'deleteSkill';

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/admin/skills/${skillData?._id}`)
            setTimeout(() => {
                router.refresh();
            }, 0);
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
                    <DialogTitle>Delete Skill</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure? You want to delete the <span className=" font-bold">{skillData?.skill}</span>. This action cannot be undone!
                </DialogDescription>
                <DialogFooter>
                    <Button type="button" disabled={loading} variant='destructive' onClick={onDelete} className="">
                        Delete {skillData?.skill}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}