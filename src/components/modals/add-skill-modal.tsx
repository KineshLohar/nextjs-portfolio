import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import * as z from 'zod'
import { taskBasedCategories } from "@/constants/constants";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { createSkill, createSkillSchema } from "@/lib/server-actions/skill.server";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";



export const AddSkillModal = () => {

    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'addSkill';

    const form = useForm<z.infer<typeof createSkillSchema>>({
        resolver: zodResolver(createSkillSchema),
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

    const onSubmit = async (values: z.infer<typeof createSkillSchema>) => {

        const result = await createSkill(values);

        if (!result.success) {
            form.setError("root", {
                message: result.error,
            });

            return;
        }

        form.reset();
        onClose();
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            onClose();
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Add Skill
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-96 overflow-y-auto">
                    <FieldGroup className="space-y-4">
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
                                        placeholder="2 or 3"
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
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                            className="w-full"
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
                                            aria-invalid={
                                                fieldState.invalid
                                            }
                                            className="w-full"
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
                                                        {category}
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
                                field: {
                                    value,
                                    onChange,
                                    ...field
                                },
                                fieldState,
                            }) => (
                                <Field
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <FieldLabel htmlFor="logo">
                                        Skill Logo
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="logo"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(
                                            event
                                        ) => {
                                            onChange(
                                                event.target
                                                    .files?.[0]
                                            );
                                        }}
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    {value && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected:{" "}
                                            {value.name}
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

                        {form.formState.errors.root && (
                            <FieldError
                                errors={[
                                    form.formState.errors
                                        .root,
                                ]}
                            />
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button disabled={isSubmitting} type="submit" className=" ">Submit</Button>
                    </DialogFooter>
                </form>
        </DialogContent>
        </Dialog >
    )
}