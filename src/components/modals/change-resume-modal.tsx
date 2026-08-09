import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from 'zod';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { updateResume, updateResumeSchema } from "@/lib/server-actions/resume.server";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

type FormValues = z.infer<typeof updateResumeSchema>;

export const ChangeResumeModal = () => {

    const { isOpen, onClose, type } = useModal();
    const isModalOpen = isOpen && type === 'changeResume';

    const form = useForm<z.infer<typeof updateResumeSchema>>({
        resolver: zodResolver(updateResumeSchema),
        defaultValues: {
            link: ''
        }
    })

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (
        values: FormValues
    ) => {
        const result = await updateResume(values);

        if (!result.success) {
            form.setError("root", {
                message: result.error,
            });

            return;
        }

        form.reset();
        onClose();
    };

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
                        Change Resume
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="space-y-4">
                        <Controller
                            name="link"
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
                                    <FieldLabel htmlFor="resume-link">
                                        Resume Link
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="resume-link"
                                        type="url"
                                        placeholder="https://..."
                                        autoComplete="url"
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
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => {
                                form.reset();
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Updating..."
                                : "Update Resume"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}