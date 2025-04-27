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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileSchema = z.custom<File>().superRefine((val, ctx) => {
    // Skip validation on server side
    if (typeof window === 'undefined') return true;

    if (!(val instanceof File)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please upload a file"
        });
        return false;
    }

    if (val.size > MAX_FILE_SIZE) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "File size must be less than 5MB"
        });
        return false;
    }

    return true;
});

const formSchema = z.object({
    skill: z.string().min(1, { message: "Skill is required!" }),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    type: z.enum([taskBasedCategories[0], ...taskBasedCategories.slice(1)]),
    experience: z.string(),
    projects: z.string(),
    description: z.string(),
    logo: fileSchema.refine(val => val instanceof File, {
        message: "Logo is required"
    }),
})



export const AddSkillModal = () => {

    const { isOpen, onClose, type } = useModal();
    const router = useRouter()
    const isModalOpen = isOpen && type === 'addSkill';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            skill: '',
            level: 'Beginner',
            type: taskBasedCategories[0],
            experience: '',
            projects: '',
            description: '',
            logo: undefined,
        }
    })

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const formData = new FormData();

        formData.append("skill", values.skill);
        formData.append("level", values.level);
        formData.append("type", values.type);
        formData.append("experience", values.experience);
        formData.append("projects", values.projects);
        formData.append("description", values.description);
        formData.append("logo", values.logo);

        try {
            const response = await axios.post('/api/admin/skills', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (response.status === 201) {
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
                        Add Skill
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-96 overflow-y-auto">
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
                            <FormField
                                name="logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Skill Logo</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(file);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        {field.value && (
                                            <div className="mt-2 text-sm text-muted-foreground">
                                                Selected: {field.value.name}
                                            </div>
                                        )}
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