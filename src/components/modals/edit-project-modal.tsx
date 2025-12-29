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
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { MultiSelect } from "../ui/multi-select";
import Image from "next/image";

interface ImagesType {
    _id: string;
    public_id: string;
    url: string;
    caption: string;
}

interface FileProps {
    file: File;
    caption: string;
}

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
    title: z.string().min(1),
    description: z.string().min(1),
    demoLink: z.string().optional(),
    repoLink: z.string().optional(),
    // techs: z.string().min(1),
    techs: z.array(z.string()),
    thumbnail: z.union([
        fileSchema,
        z.object({
            id: z.string(),
            url: z.string()
        })
    ]).refine(
        (value) => {
            if (typeof window === 'undefined') return true;
            return value instanceof File ? value.size <= MAX_FILE_SIZE : true;
        },
        { message: "File size must be less than 5MB" }
    ),
    images: z.array(z.union([
        z.object({
            file: fileSchema,
            caption: z.string().min(1, { message: "Caption is required" })
        }),
        z.object({
            _id: z.string(),
            public_id: z.string(),
            url: z.string(),
            caption: z.string().min(1, { message: "Caption is required" })
        })
    ]))
    // thumbnail: z.union([
    //     z.instanceof(File),
    //     z.object({
    //         id: z.string(),
    //         url: z.string()
    //     })
    // ]).refine(
    //     (value) => value instanceof File ? value.size <= MAX_FILE_SIZE : true,
    //     "File size must be less than 5MB"
    // ),
    // images: z.array(z.union([
    //     z.object({
    //         file: z.instanceof(File),
    //         caption: z.string().min(1)
    //     }),
    //     z.object({
    //         _id: z.string(),
    //         public_id: z.string(),
    //         url: z.string(),
    //         caption: z.string().min(1)
    //     })
    // ])).min(1)
});

export const EditProjectModal = () => {
    const { isOpen, type, onClose, data } = useModal();
    const [deletedImages, setDeletedImages] = useState<ImagesType[]>([]);
    const [previousThumbnail, setPreviousThumbnail] = useState<{ id: string; url: string } | null>(null);
    const [skills, setSkills] = useState([]);
    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const { projectData } = data;
    const isModalOpen = isOpen && type === 'editProject';

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

    useEffect(() => {
        if (projectData) {
            form.reset({
                title: projectData.title,
                description: projectData.description,
                demoLink: projectData.demoLink,
                repoLink: projectData.repoLink,
                techs: projectData.techs?.map(item => item?._id),
                thumbnail: projectData.thumbnail,
                images: projectData.images.map(img => ({
                    _id: img?._id,
                    public_id: img.public_id,
                    url: img.url,
                    caption: img.caption
                }))
            });
            setPreviousThumbnail(null);
            setDeletedImages([]);
        }
    }, [projectData, form]);

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
            if (values.thumbnail instanceof File) {
                formData.append('thumbnail', values.thumbnail);
            }

            if (previousThumbnail) {
                formData.append('removeThumbnail', previousThumbnail?.id)
            }

            const existingImages: { _id: string; public_id: string; url: string; caption: string; }[] = [];
            const newImages: { file: File; caption: string }[] = [];

            values.images.forEach((image) => {
                if ('url' in image) {
                    existingImages.push({
                        _id: image?._id,
                        public_id: image?.public_id,
                        url: image.url,
                        caption: image.caption
                    });
                } else {
                    newImages.push({
                        file: image.file,
                        caption: image.caption
                    });
                }
            });

            formData.append('existingImages', JSON.stringify(existingImages));
            newImages.forEach((image, index) => {
                formData.append(`newImages[${index}][file]`, image.file);
                formData.append(`newImages[${index}][caption]`, image.caption);
            });

            deletedImages.forEach(del => {
                formData.append('deletedImages', del?.public_id);
            });

            // console.log("DELETE IMAGES", deletedImages);


            const response = await axios.patch(`/api/admin/projects/${projectData?._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                onClose();
                form.reset();
                router.refresh();
            }
        } catch (error) {
            console.log("Submission error:", error);
        }
    };

    const handleImageRemove = (index: number, field: ImagesType | FileProps) => {
        // console.log("DELETE", field);
        const image = fields[index];

        if ('_id' in image) {
            setDeletedImages(prev => [...prev, field as ImagesType]);
        }
        remove(index);
    };

    const handleRestoreImage = (field: ImagesType) => {
        append({ _id: field?._id, public_id: field?.public_id, url: field?.url, caption: field?.caption })
        const delimages = deletedImages.filter(item => item?._id !== field?._id)
        setDeletedImages(delimages)
    }

    const handleClose = () => {
        form.reset();
        onClose();
    };



    const isSubmitting = form.formState.isSubmitting;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-sm">Edit Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
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
                                                defaultValue={field.value}
                                                options={skills}
                                                onValueChange={field.onChange}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project Thumbnail</FormLabel>
                                        <div className="space-y-2 flex justify-between">
                                            {/* DB Thumbnail (URL) */}
                                            {field.value?.url && (
                                                <div>
                                                    <Image
                                                        width={120}
                                                        height={120}
                                                        src={field.value.url}
                                                        alt="Current thumbnail"
                                                        className="h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setPreviousThumbnail(field.value);
                                                                // Trigger hidden input after DOM update
                                                                setTimeout(() => {
                                                                    thumbnailInputRef.current?.click();
                                                                }, 100);
                                                            }}
                                                        >
                                                            Change Thumbnail
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {field.value instanceof File && (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-muted-foreground">{field.value.name}</div>
                                                    <Image
                                                        width={120}
                                                        height={120}
                                                        src={URL.createObjectURL(field.value)}
                                                        alt="Current thumbnail"
                                                        className="h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setTimeout(() => {
                                                                    thumbnailInputRef.current?.click();
                                                                }, 100);
                                                            }}
                                                        >
                                                            Change Thumbnail
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {
                                                previousThumbnail && <div>
                                                    <Image
                                                        width={120}
                                                        height={120}
                                                        src={previousThumbnail.url}
                                                        alt="Current thumbnail"
                                                        className="h-32 object-cover rounded-lg"
                                                    />
                                                    <div className="flex gap-2 mt-4">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="border border-green-500 text-green-500"
                                                            onClick={() => {
                                                                if (previousThumbnail) {
                                                                    form.setValue("thumbnail", previousThumbnail);
                                                                    setPreviousThumbnail(null);
                                                                } else {
                                                                    // form.setValue("thumbnail", undefined);
                                                                }
                                                            }}
                                                        >
                                                            Restore Thumbnail
                                                        </Button>
                                                    </div>
                                                </div>
                                            }


                                            <FormControl>
                                                <Input
                                                    ref={thumbnailInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            form.setValue("thumbnail", file);
                                                        }
                                                    }}
                                                />
                                            </FormControl>

                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <div className="space-y-4">
                                {fields?.length > 0 && fields.map((field, index) => (
                                    <div key={field.id} className="space-y-2 border p-4 rounded-lg">
                                        {'url' in field ? (
                                            <div className="space-y-2">
                                                <Image
                                                    width={120}
                                                    height={120}
                                                    src={field.url}
                                                    alt={`Image ${index + 1}`}
                                                    className="h-32 object-cover rounded-lg"
                                                />
                                                <FormField
                                                    name={`images.${index}.caption`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Caption</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <FormField
                                                    name={`images.${index}.file`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>New Image {index + 1}</FormLabel>
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
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    name={`images.${index}.caption`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Caption</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleImageRemove(index, field)}
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                ))}
                                {fields?.length > 0 && <Separator className="bg-green-900" />}
                                {
                                    deletedImages?.length > 0 && (
                                        <div className="w-full">
                                            <FormLabel className="">Deleted Images</FormLabel>
                                            {deletedImages?.length > 0 && deletedImages?.map((delImg, index) => (
                                                <div key={delImg?.public_id || index} className="space-y-2 border p-4 rounded-lg mt-2">
                                                    <div className="flex items-center justify-between">
                                                        <Image
                                                            width={120}
                                                            height={120}
                                                            src={delImg.url}
                                                            alt={`Image ${index + 1}`}
                                                            className="h-32 max-w-6/12 object-cover rounded-lg"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant='ghost'
                                                            className="border  border-green-500 text-green-500"
                                                            size="sm"
                                                            onClick={() => handleRestoreImage(delImg)}
                                                        >Restore</Button>
                                                    </div>
                                                    <div className="p-2">
                                                        {delImg?.caption}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ file: null!, caption: '' })}
                                >
                                    Add New Image
                                </Button>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update Project'}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};