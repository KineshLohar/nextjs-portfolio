import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";


export const DeleteContactModal = () => {

    const { onClose, isOpen, type, data } = useModal();
    const contactData = data?.contactData;
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const isModalOpen = isOpen && type === 'deleteContact';

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/admin/contact/${contactData?._id}`)
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
                    <DialogTitle>Delete Contact</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure? You want to delete the <span className=" font-bold">{contactData?.email}</span>. This action cannot be undone!

                    <br/>
                    Message: {contactData?.message}
                </DialogDescription>
                <DialogFooter>
                    <Button type="button" disabled={loading} variant='destructive' onClick={onDelete} className="">
                        Delete {contactData?.fullName}&apos;s
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}