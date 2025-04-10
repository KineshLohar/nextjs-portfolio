import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod'
import { educationOrCertification } from "@/constants/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required!" }),
    description: z.string(),
    type: z.enum([educationOrCertification[0], ...educationOrCertification.slice(1)])
})



export const EditEducationOrCertificationModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter()
    const { eduAndCertData } = data
    const isModalOpen = isOpen && type === 'editEduOrCert';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            type: educationOrCertification[0]
        }
    })

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if(eduAndCertData){
            form.setValue('title', eduAndCertData?.title);
            form.setValue('description', eduAndCertData?.description);
            form.setValue('type', eduAndCertData?.type)
        }
    }, [form,eduAndCertData])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/admin/edu-cert/${eduAndCertData?._id}`, values)
            if (response.status === 200) {
                form.reset();
                onClose();
                setTimeout(() => {
                    router.refresh();
                }, 0);
            }
        } catch (error) {
            console.log("ERROR Editing EDU CERT ", error);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Edit Education or Certifications
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" space-y-4">
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Title ....."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="description ....."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="type"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Type
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {educationOrCertification.map((cat, i) => (
                                                    <SelectItem key={i} value={cat}>{cat}</SelectItem>
                                                ))}

                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-4">
                            <Button disabled={isSubmitting} type="submit" className=" cursor-pointer">Update</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}