import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
    link: z.string().min(1, { message: "Link is required!" }),
})



export const ChangeResumeModal = () => {

    const { isOpen, onClose, type } = useModal();
    const router = useRouter()
    const isModalOpen = isOpen && type === 'changeResume';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            link: ''
        }
    })

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch('/api/admin/resume', values)
            if (response.status === 200) {
                form.reset();
                onClose();
                setTimeout(() => {
                    router.refresh();
                }, 0);
            }
        } catch (error) {
            console.log("ERROR SUBMITING SKILL ", error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Change Resume
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" space-y-4">
                            <FormField
                                name="link"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Link
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="React"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button disabled={isSubmitting} type="submit" className=" ">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}