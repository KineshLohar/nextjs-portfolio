"use client";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Controller,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldLegend,
} from "../ui/field";
import { Input } from "../ui/input";
import { createWorkExperience, workExperienceSchema } from "@/lib/server-actions/work.server";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type FormValues = z.infer<typeof workExperienceSchema>;

export const AddWorkExpModal = () => {
    const { isOpen, type, onClose } = useModal();
    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const isModalOpen =
        isOpen && type === "addWorkExp";

    const form = useForm<FormValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            role: "",
            company: "",
            location: "",
            techs: "",
            descriptions: [],
            currentlyWorking: false,
            startDate: new Date(),
            endDate: new Date(),
        },
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control: form.control,
        name: "descriptions",
    });

    const isSubmitting =
        form.formState.isSubmitting;

    const currentlyWorking =
        form.watch("currentlyWorking");

    const onSubmit = async (
        values: FormValues
    ) => {
        setServerError(null);

        const response =
            await createWorkExperience(values);

        if (!response.success) {
            if (
                response.error.toLowerCase().includes(
                    "unauthorized"
                )
            ) {
                setServerError(
                    "Your session has expired. Please login again."
                );

                return;
            }

            setServerError(response.error);

            return;
        }

        form.reset();

        onClose();

        router.refresh();
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
            <DialogContent
                className="max-h-[80vh] overflow-y-auto"
                onInteractOutside={(event) => {
                    if (isSubmitting) {
                        event.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>
                        Add Work Experience
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
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
                                    <FieldLabel htmlFor="work-role">
                                        Role
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="work-role"
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
                                    <FieldLabel htmlFor="work-company">
                                        Company
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="work-company"
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
                            name="currentlyWorking"
                            control={form.control}
                            render={({
                                field,
                                fieldState,
                            }) => (
                                <Field
                                    orientation="horizontal"
                                    data-invalid={
                                        fieldState.invalid
                                    }
                                >
                                    <Checkbox
                                        id="currently-working"
                                        checked={
                                            field.value
                                        }
                                        onCheckedChange={
                                            field.onChange
                                        }
                                        aria-invalid={
                                            fieldState.invalid
                                        }
                                    />

                                    <FieldLabel htmlFor="currently-working">
                                        Currently Working
                                    </FieldLabel>

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
                                    <FieldLabel htmlFor="work-location">
                                        Location
                                        <span className="ml-1 text-xs opacity-70">
                                            (optional)
                                        </span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="work-location"
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
                                    <FieldLabel htmlFor="work-techs">
                                        Techs
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="work-techs"
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

                        <FieldSet>
                            <FieldLegend variant="label">
                                Descriptions
                            </FieldLegend>

                            <div className="mt-2 space-y-2">
                                {fields.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <Controller
                                            key={item.id}
                                            name={`descriptions.${index}.text`}
                                            control={
                                                form.control
                                            }
                                            render={({
                                                field,
                                                fieldState,
                                            }) => (
                                                <Field
                                                    orientation="horizontal"
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter a description"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                    />

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        disabled={
                                                            isSubmitting
                                                        }
                                                        onClick={() =>
                                                            remove(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </Button>

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
                                    )
                                )}

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="mt-2 w-full"
                                    disabled={
                                        isSubmitting
                                    }
                                    onClick={() =>
                                        append({
                                            text: "",
                                        })
                                    }
                                >
                                    Add Description
                                </Button>
                            </div>
                        </FieldSet>

                        <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2">
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
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    {field.value
                                                        ? format(
                                                              field.value,
                                                              "PPP"
                                                          )
                                                        : "Pick Start date"}

                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <DatePicker
                                                    selected={
                                                        field.value
                                                    }
                                                    onChange={
                                                        field.onChange
                                                    }
                                                    dateFormat="yyyy/MM/dd"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    maxDate={
                                                        new Date()
                                                    }
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
                                                    disabled={
                                                        currentlyWorking
                                                    }
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    {field.value
                                                        ? format(
                                                              field.value,
                                                              "PPP"
                                                          )
                                                        : "Pick End date"}

                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <DatePicker
                                                    selected={
                                                        field.value
                                                    }
                                                    onChange={
                                                        field.onChange
                                                    }
                                                    dateFormat="yyyy/MM/dd"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    minDate={
                                                        form.watch(
                                                            "startDate"
                                                        )
                                                    }
                                                    maxDate={
                                                        new Date()
                                                    }
                                                    disabled={
                                                        currentlyWorking
                                                    }
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
                        </div>

                        {serverError && (
                            <div
                                role="alert"
                                className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                            >
                                {serverError}
                            </div>
                        )}
                    </FieldGroup>

                    <DialogFooter className="mt-6">
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
                                ? "Saving..."
                                : "Save Experience"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};