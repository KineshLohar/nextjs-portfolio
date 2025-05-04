import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { MultiSelect } from "../ui/multi-select";

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
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    demoLink: z.string().optional(),
    repoLink: z.string().optional(),
    // techs: z.string().min(1, { message: "Techs are required" }),
    techs: z.array(z.string()),
    thumbnail: fileSchema.refine(val => val instanceof File, {
        message: "Thumbnail is required"
    }),
    images: z.array(z.object({
        file: fileSchema.refine(val => val instanceof File, {
            message: "Image is required"
        }),
        caption: z.string().min(1, { message: "Caption is required" })
    }))
    // .min(1, { message: "At least one image is required" })
    // z.instanceof(File, { message: "Thumbnail is required" })
    //     .refine(file => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB"),
    // images: z.array(z.object({
    //     file: z.instanceof(File, { message: "Image is required" })
    //         .refine(file => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB"),
    //     caption: z.string().min(1, { message: "Caption is required" })
    // })).min(1, { message: "At least one image is required" })
});

export const AddProjectModal = () => {
    const { isOpen, type, onClose } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'addProject';
    const [skills, setSkills] = useState([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            demoLink: '',
            repoLink: '',
            techs: [],
            thumbnail: undefined,
            images: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "images"
    });

    const fetchSkills = async () => {
        try {
            const res = await axios.get('/api/admin/skills');
            // console.log("RES OF FETCH SKILLS", res);
            setSkills(res.data)

        } catch (error) {
            console.log("ERROR FETCHING SKILLS", error);
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            fetchSkills();
        }
    }, [isModalOpen])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();

            // Append all text fields
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('demoLink', values.demoLink || '');
            formData.append('repoLink', values.repoLink || '');
            formData.append('techs', JSON.stringify(values.techs));

            // Append thumbnail file
            formData.append('thumbnail', values.thumbnail);

            // Append images with captions
            values.images.forEach((image, index) => {
                formData.append(`images[${index}][file]`, image.file);
                formData.append(`images[${index}][caption]`, image.caption);
            });

            const response = await axios.post('/api/admin/projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                onClose();
                form.reset();
                router.refresh();
            }
        } catch (error) {
            console.log("Submission error:", error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    console.log("TECHS",form.getValues("techs"));
    

    const isSubmitting = form.formState.isSubmitting;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Title Field */}
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My Awesome Project" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description Field */}
                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your project..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Demo Link Field */}
                            <FormField
                                name="demoLink"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Demo Link (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://demo.example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Repo Link Field */}
                            <FormField
                                name="repoLink"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repository Link (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://github.com/username/repo" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Techs Field */}
                            {/* <FormField
                                name="techs"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormControl>
                                            <Input placeholder="React, Node.js, MongoDB" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            <FormField
                                name="techs"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Technologies Used</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={skills}
                                                onValueChange={field.onChange}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            {/* Thumbnail Upload */}
                            <FormField
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Thumbnail</FormLabel>
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

                            {/* Project Images with Captions */}
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="space-y-2 border p-4 rounded-lg">
                                        <FormField
                                            name={`images.${index}.file`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Image {index + 1}</FormLabel>
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
                                                        <div className="mt-1 text-sm text-muted-foreground">
                                                            Selected: {field.value.name}
                                                        </div>
                                                    )}
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name={`images.${index}.caption`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Caption</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter image caption" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ file: null!, caption: '' })}
                                >
                                    Add Another Image
                                </Button>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};