import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { workExperienceSchema, type WorkExperienceInput } from "@/lib/validations/work.validation";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { updateWorkExperience } from "@/lib/server-actions/work.server";

export const EditWorkExpModal = () => {

    const { isOpen, type, onClose, data } = useModal();
    const workExperienceData = data.workExperienceData;

    const isModalOpen = isOpen && type === 'editWorkExp';

    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<WorkExperienceInput>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            role: '',
            company: '',
            location: '',
            techs: '',
            descriptions: [],
            currentlyWorking: false,
            startDate: new Date(),
            endDate: new Date(),
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "descriptions"
    });

    useEffect(() => {
        if (!workExperienceData) {
            return;
        }

        form.reset({
            role: workExperienceData.role ?? "",
            company: workExperienceData.company ?? "",
            location: workExperienceData.location ?? "",
            techs: workExperienceData.techs ?? "",

            descriptions:
                workExperienceData.descriptions?.map(
                    (description) => ({
                        text: description.text ?? "",
                    })
                ) ?? [{ text: "" }],

            currentlyWorking:
                workExperienceData.currentlyWorking ?? false,

            startDate: new Date(
                workExperienceData.startDate
            ),

            endDate: workExperienceData.endDate
                ? new Date(workExperienceData.endDate)
                : undefined,
        });

        setServerError(null);
    }, [workExperienceData, form]);

    const onSubmit = async (
        values: WorkExperienceInput
    ) => {
        if (!workExperienceData) {
            setServerError(
                "Work experience data is missing."
            );

            return;
        }

        setServerError(null);

        const response =
            await updateWorkExperience(
                String(workExperienceData._id),
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
        if (form.formState.isSubmitting) {
            return;
        }

        form.reset();
        setServerError(null);
        onClose();
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[80vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Edit Work Experience
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <form
                        onSubmit={form.handleSubmit(
                            onSubmit
                        )}
                        className="space-y-4"
                    >
                        <Controller
                            name="role"
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
                                        Role
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="Software Developer"
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
                            name="company"
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
                                        Company
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="Microsoft"
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
                            name="location"
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
                                        Location
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="Mumbai or Remote"
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
                                        Technologies
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        placeholder="React, Node, Express"
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

                        <Field>
                            <FieldLabel>
                                Descriptions
                            </FieldLabel>

                            <div className="space-y-2">
                                {fields.map(
                                    (
                                        field,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                field.id
                                            }
                                            className="flex gap-2"
                                        >
                                            <Controller
                                                name={`descriptions.${index}.text`}
                                                control={
                                                    form.control
                                                }
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <Field
                                                        className="flex-1"
                                                        data-invalid={
                                                            fieldState.invalid
                                                        }
                                                    >
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter a description"
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
                                                onClick={() =>
                                                    remove(
                                                        index
                                                    )
                                                }
                                            >
                                                X
                                            </Button>
                                        </div>
                                    )
                                )}

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() =>
                                        append({
                                            text: "",
                                        })
                                    }
                                >
                                    Add Description
                                </Button>
                            </div>
                        </Field>

                        <Controller
                            name="currentlyWorking"
                            control={form.control}
                            render={({
                                field,
                            }) => (
                                <Field orientation="horizontal" className="flex flex-row items-center justify-start gap-3">
                                    <Checkbox
                                        checked={
                                            field.value
                                        }
                                        onCheckedChange={
                                            field.onChange
                                        }
                                        className=""
                                    />

                                    <FieldLabel className="flex-1">
                                        Currently Working
                                    </FieldLabel>
                                </Field>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Controller
                                name="startDate"
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
                                            Start Date
                                        </FieldLabel>

                                        <Popover>
                                            <PopoverTrigger
                                                asChild
                                            >
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {field.value
                                                        ? format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                        : "Pick start date"}

                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-auto p-4">
                                                <input
                                                    type="date"
                                                    value={
                                                        field.value
                                                            ? field.value
                                                                .toISOString()
                                                                .split(
                                                                    "T"
                                                                )[0]
                                                            : ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) => {
                                                        field.onChange(
                                                            new Date(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        );
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>

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
                                name="endDate"
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
                                            End Date
                                        </FieldLabel>

                                        <Popover>
                                            <PopoverTrigger
                                                asChild
                                            >
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={form.watch(
                                                        "currentlyWorking"
                                                    )}
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {field.value
                                                        ? format(
                                                            field.value,
                                                            "PPP"
                                                        )
                                                        : "Pick end date"}

                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            {!form.watch(
                                                "currentlyWorking"
                                            ) && (
                                                    <PopoverContent className="w-auto p-4">
                                                        <input
                                                            type="date"
                                                            value={
                                                                field.value
                                                                    ? field.value
                                                                        .toISOString()
                                                                        .split(
                                                                            "T"
                                                                        )[0]
                                                                    : ""
                                                            }
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                field.onChange(
                                                                    event
                                                                        .target
                                                                        .value
                                                                        ? new Date(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                        : undefined
                                                                );
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                )}
                                        </Popover>

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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={
                                    isSubmitting
                                }
                                onClick={
                                    handleClose
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting
                                }
                            >
                                {isSubmitting
                                    ? "Updating..."
                                    : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}