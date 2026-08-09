import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import { Textarea } from "../ui/textarea";
import { createProject, createProjectSchema, type CreateProjectInput } from "@/lib/server-actions/project.server";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { getSkillOptions } from "@/lib/server-actions/skill.server";

type SkillOption = {
    _id: string;
    skill: string;
};

export const AddProjectModal = () => {
    const { isOpen, type, onClose } = useModal();
    const router = useRouter();
    const [skills, setSkills] = useState<SkillOption[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);

    const isModalOpen = isOpen && type === 'addProject';

    const form = useForm<
        z.input<typeof createProjectSchema>,
        unknown,
        z.output<typeof createProjectSchema>
    >({
        resolver: zodResolver(createProjectSchema),
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

    const isSubmitting = form.formState.isSubmitting;

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

            setSkills(
                response.data
            );
        };

        setServerError(null);
        loadSkills();

        return () => {
            cancelled = true;
        };
    }, [isModalOpen]);

    const onSubmit = async (
        values: CreateProjectInput
    ) => {
        setServerError(null);

        try {
            const response =
                await createProject(values);

            if (!response.success) {
                setServerError(response.error);
                return;
            }

            form.reset();
            setServerError(null);
            onClose();
            router.refresh();
        } catch (error) {
            console.error(
                "[AddProjectModal]",
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




    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle>Add New Project</DialogTitle>
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
                                    <FieldLabel htmlFor="project-title">
                                        Project Title
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="project-title"
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
                                    <FieldLabel htmlFor="project-description">
                                        Description
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id="project-description"
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
                                    <FieldLabel htmlFor="project-demo">
                                        Demo Link
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (optional)
                                        </span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="project-demo"
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

                        {/* Repo Link Field */}
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
                                    <FieldLabel htmlFor="project-repo">
                                        Repository Link
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            (optional)
                                        </span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="project-repo"
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
                                    <FieldLabel htmlFor="project-thumbnail">
                                        Project Thumbnail
                                    </FieldLabel>

                                    <Input
                                        id="project-thumbnail"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                        onChange={(event) => {
                                            field.onChange(
                                                event.target.files?.[0]
                                            );
                                        }}
                                    />

                                    {field.value && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected:{" "}
                                            {field.value.name}
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

                        {/* Project Images with Captions */}
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
                                    Add Another Image
                                </Button>
                            </div>
                            {fields.map(
                                (item, index) => (
                                    <div
                                        key={item.id}
                                        className="space-y-4 rounded-lg border p-4"
                                    >
                                        <Controller
                                            name={`images.${index}.file`}
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
                                                        Image{" "}
                                                        {index +
                                                            1}
                                                    </FieldLabel>

                                                    <Input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        onChange={(
                                                            event
                                                        ) => {
                                                            field.onChange(
                                                                event
                                                                    .target
                                                                    .files?.[0]
                                                            );
                                                        }}
                                                    />

                                                    {field.value && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Selected:{" "}
                                                            {
                                                                field
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

                                        <Controller
                                            name={`images.${index}.caption`}
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
                                                        Caption
                                                    </FieldLabel>

                                                    <Input
                                                        {...field}
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
                                                remove(index)
                                            }
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                )
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ file: null!, caption: '' })}
                            >
                                Add Another Image
                            </Button>
                        </div>
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
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
};