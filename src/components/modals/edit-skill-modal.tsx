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
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const fileSchema = z.custom<File>().superRefine((val, ctx) => {
    if (typeof window === 'undefined') return true;
    if (!(val instanceof File)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please upload a file" });
        return false;
    }
    if (val.size > MAX_FILE_SIZE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File size must be under 5MB" });
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
    logo: z.union([
        fileSchema,
        z.object({
            public_id: z.string(),
            url: z.string()
        })
    ])
})

export const EditSkillModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const { skillData } = data;
    const router = useRouter()
    const isModalOpen = isOpen && type === 'editSkill';

    const logoInputRef = useRef<HTMLInputElement>(null);
    const [previousLogo, setPreviousLogo] = useState<{ public_id: string; url: string } | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            skill: '',
            level: 'Beginner',
            type: taskBasedCategories[0],
            experience: '',
            projects: '',
            description: '',
            logo: undefined
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
            form.setValue('experience', skillData?.experience);
            form.setValue('logo', skillData?.logo);

        }
    }, [form, skillData])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append("skill", values.skill);
            formData.append("level", values.level);
            formData.append("type", values.type);
            formData.append("experience", values.experience);
            formData.append("projects", values.projects);
            formData.append("description", values.description);

            if (values.logo instanceof File) {
                formData.append("logo", values.logo);
            }

            if (previousLogo) {
                formData.append("removeLogo", previousLogo.public_id);
            }
            const response = await axios.patch(`/api/admin/skills/${skillData?._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            )
            if (response.status === 200) {
                form.reset()
                router.refresh();
                setPreviousLogo(null)
                onClose();
            }
        } catch (error) {
            console.log("ERROR SUBMITING SKILL ", error);
        }
    }

    const handleClose = () => {
        onClose();
    }

    // console.log("SKILL EDIT", skillData);
    

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
                        <div className=" space-y-4 max-h-96 overflow-y-auto">
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
                                        <FormLabel>Logo</FormLabel>
                                        <div className="space-y-2 flex gap-4 items-start">
                                            {field.value?.url && (
                                                <div>
                                                    <Image src={field.value.url} alt="Logo preview" width={100} height={100} className="h-24 w-24 rounded object-cover" />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setPreviousLogo(field.value);
                                                            setTimeout(() => logoInputRef.current?.click(), 100);
                                                        }}
                                                    >
                                                        Change Logo
                                                    </Button>
                                                </div>
                                            )}

                                            {field.value instanceof File && (
                                                <div>
                                                    <Image src={URL.createObjectURL(field.value)} width={100} height={100} alt="New logo" className="h-24 w-24 rounded object-cover" />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-2"
                                                        onClick={() => setTimeout(() => logoInputRef.current?.click(), 100)}
                                                    >
                                                        Change Logo
                                                    </Button>
                                                </div>
                                            )}

                                            {previousLogo && (
                                                <div>
                                                    <Image src={previousLogo.url} alt="Previous logo" width={100} height={100} className="h-24 w-24 rounded object-cover" />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-600 text-green-600 mt-2"
                                                        onClick={() => {
                                                            form.setValue("logo", previousLogo);
                                                            setPreviousLogo(null);
                                                        }}
                                                    >
                                                        Restore Logo
                                                    </Button>
                                                </div>
                                            )}

                                            <FormControl>
                                                <Input
                                                    ref={logoInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            form.setValue("logo", file);
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
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