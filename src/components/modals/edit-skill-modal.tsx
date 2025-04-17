import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod'
import { taskBasedCategories } from "@/constants/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
    skill: z.string().min(1, { message: "Skill is required!" }),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    type: z.enum([taskBasedCategories[0], ...taskBasedCategories.slice(1)]),
    experience: z.string(),
    projects: z.string(),
    description: z.string()
})

export const EditSkillModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { skillData } = data;
    const router = useRouter()
    const isModalOpen = isOpen && type === 'editSkill';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            skill: '',
            level: 'Beginner',
            type: taskBasedCategories[0],
            experience: '',
            projects: '',
            description: ''
        }
    })

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if (skillData) {
            form.setValue('level', skillData?.level as "Beginner" | "Intermediate" | "Advanced")
            form.setValue('skill', skillData?.skill);
            form.setValue('type', skillData?.type)
            form.setValue('description', skillData?.description)
            form.setValue('projects', skillData?.projects)
            form.setValue('experience', skillData?.experience)
        }
    }, [form, skillData])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/admin/skills/${skillData?._id}`, values)
            if (response.status === 200) {
                form.reset()
                router.refresh();
                onClose();
            }
        } catch (error) {
            console.log("ERROR SUBMITING SKILL ", error);
        }
    }

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Edit Skill
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=" space-y-4">
                            <FormField
                                name="skill"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Skill
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
                            <FormField
                                name="projects"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Projects Completed
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="10 or 20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="experience"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Experience
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="2 or 3"
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
                                                placeholder="Decription here...."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="level"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Skill
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Beginner">Beginner</SelectItem>
                                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                <SelectItem value="Advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                {taskBasedCategories.map((cat, i) => (
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
                            <Button disabled={isSubmitting} type="submit" className=" cursor-pointer">Submit</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}