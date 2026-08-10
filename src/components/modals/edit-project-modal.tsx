import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { MultiSelect } from "../ui/multi-select";
import Image from "next/image";
import { updateProject } from "@/lib/server-actions/project.server";
import { getSkillOptions } from "@/lib/server-actions/skill.server";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { updateProjectSchema, type UpdateProjectInput } from "@/lib/validations/project.validation";

type SkillOption = {
    _id: string;
    skill: string;
};

export const EditProjectModal = () => {
    const { isOpen, type, onClose, data } = useModal();
    const { projectData } = data;

    const [skills, setSkills] = useState<SkillOption[]>([]);
    const [serverError, setServerError] =
        useState<string | null>(null);

    const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

    const isModalOpen = isOpen && type === 'editProject';

    const form = useForm<
        z.input<typeof updateProjectSchema>,
        unknown,
        z.output<typeof updateProjectSchema>
    >({
        resolver: zodResolver(updateProjectSchema),
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

    useEffect(() => {
        if (!isModalOpen) return;

        let cancelled = false;

        const loadSkills = async () => {
            const response =
                await getSkillOptions();

            if (cancelled) return;

            if (!response.success) {
                setServerError(response.error);
                return;
            }

            setSkills(response.data);
        };

        setServerError(null);
        loadSkills();

        return () => {
            cancelled = true;
        };
    }, [isModalOpen]);

    useEffect(() => {
        if (!isModalOpen || !projectData) return;

        form.reset({
            id: projectData._id.toString(),
            title: projectData.title,
            description: projectData.description,
            demoLink: projectData.demoLink ?? "",
            repoLink: projectData.repoLink ?? "",
            techs:
                projectData.techs?.map(
                    (tech) => tech._id.toString()
                ) ?? [],
            thumbnail: projectData.thumbnail
                ? {
                    id: projectData.thumbnail.id,
                    url: projectData.thumbnail.url,
                }
                : undefined,
            images:
                projectData.images?.map(
                    (image) => ({
                        public_id:
                            image.public_id,
                        url: image.url,
                        caption:
                            image.caption,
                    })
                ) ?? [],
        });

        setServerError(null);
    }, [isModalOpen, projectData, form]);

    const onSubmit = async (
        values: UpdateProjectInput
    ) => {
        setServerError(null);

        try {
            const response =
                await updateProject(values);

            if (!response.success) {
                setServerError(
                    response.error ??
                    "Failed to update project."
                );
                return;
            }

            form.reset();
            onClose();
        } catch (error) {
            console.error(
                "[EditProjectModal]",
                error
            );

            setServerError(
                "Something went wrong. Please try again."
            );
        }
    };


    const handleClose = () => {
        if (isSubmitting) return;

        form.reset();
        setServerError(null);
        onClose();
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-sm">Edit Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <Controller
                            name="title"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Project Title
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="My Awesome Project"
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Description
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        placeholder="Describe your project..."
                                        className="resize-none"
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="demoLink"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Demo Link
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://demo.example.com"
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="repoLink"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Repository Link
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://github.com/username/repo"
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="techs"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Technologies Used
                                    </FieldLabel>

                                    <MultiSelect
                                        options={skills}
                                        value={field.value}
                                        onValueChange={
                                            field.onChange
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="thumbnail"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel>
                                        Project Thumbnail
                                    </FieldLabel>

                                    {field.value &&
                                        !(
                                            field.value instanceof
                                            File
                                        ) && (
                                            <div className="space-y-3">
                                                <Image
                                                    width={160}
                                                    height={160}
                                                    src={
                                                        field
                                                            .value
                                                            .url
                                                    }
                                                    alt="Project thumbnail"
                                                    className="h-40 w-40 rounded-lg object-cover"
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        thumbnailInputRef.current?.click()
                                                    }
                                                >
                                                    Change Thumbnail
                                                </Button>
                                            </div>
                                        )}

                                    {field.value instanceof
                                        File && (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        field
                                                            .value
                                                            .name
                                                    }
                                                </p>

                                                <Image
                                                    width={160}
                                                    height={160}
                                                    src={URL.createObjectURL(
                                                        field.value
                                                    )}
                                                    alt="New thumbnail"
                                                    className="h-40 w-40 rounded-lg object-cover"
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        thumbnailInputRef.current?.click()
                                                    }
                                                >
                                                    Change Thumbnail
                                                </Button>
                                            </div>
                                        )}

                                    <Input
                                        ref={
                                            thumbnailInputRef
                                        }
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(
                                            event
                                        ) => {
                                            const file =
                                                event
                                                    .target
                                                    .files?.[0];

                                            if (file) {
                                                field.onChange(
                                                    file
                                                );
                                            }

                                            event.target.value =
                                                "";
                                        }}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[
                                                fieldState.error,
                                            ]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">
                                    Project Images
                                </h3>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        append({
                                            file: undefined as never,
                                            caption: "",
                                        })
                                    }
                                >
                                    Add Image
                                </Button>
                            </div>

                            {fields.map(
                                (field, index) => {
                                    const isExisting =
                                        "public_id" in
                                        field;

                                    return (
                                        <div
                                            key={
                                                field.id
                                            }
                                            className="space-y-4 rounded-lg border p-4"
                                        >
                                            {isExisting && (
                                                <Image
                                                    width={
                                                        160
                                                    }
                                                    height={
                                                        160
                                                    }
                                                    src={
                                                        field.url
                                                    }
                                                    alt={`Project image ${index +
                                                        1
                                                        }`}
                                                    className="h-40 w-40 rounded-lg object-cover"
                                                />
                                            )}

                                            {!isExisting && (
                                                <Controller
                                                    name={`images.${index}.file`}
                                                    control={
                                                        form.control
                                                    }
                                                    render={({
                                                        field: fileField,
                                                        fieldState,
                                                    }) => (
                                                        <Field
                                                            data-invalid={
                                                                fieldState.invalid
                                                            }
                                                        >
                                                            <FieldLabel>
                                                                Image
                                                            </FieldLabel>

                                                            <Input
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/webp"
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const file =
                                                                        event
                                                                            .target
                                                                            .files?.[0];

                                                                    if (
                                                                        file
                                                                    ) {
                                                                        fileField.onChange(
                                                                            file
                                                                        );
                                                                    }

                                                                    event.target.value =
                                                                        "";
                                                                }}
                                                            />

                                                            {fileField.value instanceof
                                                                File && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            fileField
                                                                                .value
                                                                                .name
                                                                        }
                                                                    </p>
                                                                )}

                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[
                                                                        fieldState.error,
                                                                    ]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />
                                            )}

                                            <Controller
                                                name={`images.${index}.caption`}
                                                control={
                                                    form.control
                                                }
                                                render={({
                                                    field: captionField,
                                                    fieldState,
                                                }) => (
                                                    <Field
                                                        data-invalid={
                                                            fieldState.invalid
                                                        }
                                                    >
                                                        <FieldLabel>
                                                            Caption
                                                        </FieldLabel>

                                                        <Input
                                                            {...captionField}
                                                            placeholder="Enter image caption"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                        />

                                                        {fieldState.invalid && (
                                                            <FieldError
                                                                errors={[
                                                                    fieldState.error,
                                                                ]}
                                                            />
                                                        )}
                                                    </Field>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    remove(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove Image
                                            </Button>
                                        </div>
                                    );
                                }
                            )}
                        </div>

                        {serverError && (
                            <div
                                role="alert"
                                className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                            >
                                {serverError}
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Project'}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
};