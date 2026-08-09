"use client";

import { useModal } from "@/hooks/use-modal-store";
import { educationOrCertification } from "@/constants/constants";
import { createEduCert } from "@/lib/server-actions/edu-cert.server";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import {
    Field,
    FieldError,
    FieldLabel,
} from "../ui/field";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import { eduCertSchema } from "@/lib/validations/education-certification.validation";


type FormValues = z.infer<typeof eduCertSchema>;

export const AddEducationOrCertificationModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const isModalOpen =
        isOpen && type === "addEduOrCert";

    const form = useForm<FormValues>({
        resolver: zodResolver(eduCertSchema),
        defaultValues: {
            title: "",
            description: "",
            type: educationOrCertification[0],
            thumbnail: undefined,
            startDate: new Date(),
            endDate: new Date(),
            link: "",
        },
    });

    const isSubmitting =
        form.formState.isSubmitting;

    const onSubmit = async (values: FormValues) => {
        setServerError(null);

        try {
            const response = await createEduCert(values);

            if (!response.success) {
                setServerError(response.error);
                return;
            }

            form.reset();

            onClose();

            router.refresh();
        } catch (error) {
            console.error(
                "[AddEducationOrCertificationModal]",
                error
            );

            setServerError(
                "Something went wrong. Please try again."
            );
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setServerError(null);
            form.reset();
            onClose();
        }
    };

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={handleOpenChange}
        >
            <DialogContent
                className="max-h-[90vh] overflow-y-auto"
                onInteractOutside={(event) =>
                    event.preventDefault()
                }
            >
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Add Education or Certification
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel htmlFor="edu-title">
                                    Title
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id="edu-title"
                                    placeholder="Title..."
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
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel htmlFor="edu-description">
                                    Description
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id="edu-description"
                                    placeholder="Description..."
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
                        name="type"
                        control={form.control}
                        render={({ field, fieldState }) => (
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
                                        {educationOrCertification.map(
                                            (category) => (
                                                <SelectItem
                                                    key={category}
                                                    value={category}
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
                        name="link"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >
                                <FieldLabel htmlFor="edu-link">
                                    Link
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id="edu-link"
                                    type="url"
                                    placeholder="https://example.com"
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

                    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
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
                                                    "w-full justify-start pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>
                                                        Pick start
                                                        date
                                                    </span>
                                                )}

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
                                                    field.value
                                                        ? new Date()
                                                        : undefined
                                                }
                                                inline
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
                                                className={cn(
                                                    "w-full justify-start pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>
                                                        Pick end
                                                        date
                                                    </span>
                                                )}

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
                                                    form.getValues(
                                                        "startDate"
                                                    ) ??
                                                    undefined
                                                }
                                                inline
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
                                <FieldLabel htmlFor="edu-thumbnail">
                                    Image
                                </FieldLabel>

                                <Input
                                    id="edu-thumbnail"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    aria-invalid={
                                        fieldState.invalid
                                    }
                                    onChange={(event) => {
                                        const file =
                                            event.target
                                                .files?.[0];

                                        field.onChange(
                                            file
                                        );
                                    }}
                                />

                                {field.value && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected:{" "}
                                        {
                                            field.value.name
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
                            onClick={() => {
                                setServerError(null);
                                form.reset();
                                onClose();
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};