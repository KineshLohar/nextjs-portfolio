import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { taskBasedCategories } from "@/constants/constants";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { updateSkillSchema, type UpdateSkillInput } from "@/lib/validations/skill.validation";
import { updateSkill } from "@/lib/server-actions/skill.server";
import { Field, FieldError, FieldLabel } from "../ui/field";

export const EditSkillModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const skillData = data?.skillData;
    const isModalOpen = isOpen && type === 'editSkill';

    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<UpdateSkillInput>({
        resolver: zodResolver(updateSkillSchema),
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

    if (!isModalOpen || !skillData) {
        return null;
    }

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if (!skillData) return;

        form.reset({
            skill: skillData.skill ?? "",
            level:
                skillData.level ??
                "Beginner",
            type:
                skillData.type ??
                taskBasedCategories[0],
            experience:
                skillData.experience ?? "",
            projects:
                skillData.projects ?? "",
            description:
                skillData.description ?? "",
            logo: skillData.logo ?? undefined,
        });

        setServerError(null);
    }, [skillData, form]);

    const onSubmit = async (
        values: UpdateSkillInput
    ) => {
        if (!skillData) {
            setServerError("Skill data is missing.");
            return;
        }
        
        setServerError(null);

        const response = await updateSkill(
            skillData._id.toString(),
            values
        );

        if (!response.success) {
            setServerError(response.error);
            return;
        }

        form.reset();
        onClose();
    };

    const handleClose = () => {
        if (isSubmitting) return;

        setServerError(null);
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Edit Skill
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="max-h-96 space-y-4 overflow-y-auto">
                        <Controller
                            name="skill"
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
                                    <FieldLabel htmlFor="skill">
                                        Skill
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="skill"
                                        placeholder="React"
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
                            name="projects"
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
                                    <FieldLabel htmlFor="projects">
                                        Projects Completed
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="projects"
                                        placeholder="10 or 20"
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
                            name="experience"
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
                                    <FieldLabel htmlFor="experience">
                                        Experience
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="experience"
                                        placeholder="2 or 3 years"
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
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="description"
                                        placeholder="Description here..."
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
                            name="level"
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
                                        Level
                                    </FieldLabel>

                                    <Select
                                        value={field.value}
                                        onValueChange={
                                            field.onChange
                                        }
                                    >
                                        <SelectTrigger
                                            className="w-full"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="Beginner">
                                                Beginner
                                            </SelectItem>

                                            <SelectItem value="Intermediate">
                                                Intermediate
                                            </SelectItem>

                                            <SelectItem value="Advanced">
                                                Advanced
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

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
                            name="type"
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
                                        Type
                                    </FieldLabel>

                                    <Select
                                        value={field.value}
                                        onValueChange={
                                            field.onChange
                                        }
                                    >
                                        <SelectTrigger
                                            className="w-full"
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                        >
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {taskBasedCategories.map(
                                                (category) => (
                                                    <SelectItem
                                                        key={
                                                            category
                                                        }
                                                        value={
                                                            category
                                                        }
                                                    >
                                                        {
                                                            category
                                                        }
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>

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
                            name="logo"
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
                                        Logo
                                    </FieldLabel>

                                    <div className="space-y-3">
                                        {field.value &&
                                            !(
                                                field.value instanceof
                                                File
                                            ) && (
                                                <Image
                                                    src={
                                                        field
                                                            .value
                                                            .url
                                                    }
                                                    alt={
                                                        skillData.skill
                                                    }
                                                    width={96}
                                                    height={96}
                                                    className="h-24 w-24 rounded object-contain"
                                                />
                                            )}

                                        {field.value instanceof
                                            File && (
                                                <Image
                                                    src={URL.createObjectURL(
                                                        field.value
                                                    )}
                                                    alt="New logo"
                                                    width={96}
                                                    height={96}
                                                    className="h-24 w-24 rounded object-contain"
                                                />
                                            )}

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
                                                    field.onChange(
                                                        file
                                                    );
                                                }
                                            }}
                                        />
                                    </div>

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
                    </div>

                    {serverError && (
                        <div
                            role="alert"
                            className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                        >
                            {serverError}
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Updating..."
                                : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}