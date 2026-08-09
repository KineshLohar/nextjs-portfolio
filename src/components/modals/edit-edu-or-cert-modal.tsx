import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import * as z from 'zod'
import { educationOrCertification } from "@/constants/constants";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import Image from "next/image";
import { updateEduCert } from "@/lib/server-actions/edu-cert.server";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { updateEduCertSchema } from "@/lib/validations/education-certification.validation";

const formSchema = updateEduCertSchema.omit({
    id: true,
});

type FormValues = z.infer<typeof formSchema>;

export const EditEducationOrCertificationModal = () => {

    const { isOpen, onClose, type, data } = useModal();
    const eduAndCertData = data?.eduAndCertData;

    const isModalOpen = isOpen && type === 'editEduOrCert';

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [previousThumbnail, setPreviousThumbnail] = useState<{ public_id: string, url: string } | null>(null);

    const [serverError, setServerError] =
        useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            type: educationOrCertification[0] ?? '',
            startDate: null,
            endDate: null,
            thumbnail: undefined,
            link: ""

        }
    })

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        if (!eduAndCertData || !isModalOpen) {
            return;
        }

        const thumbnail =
            eduAndCertData.thumbnail;

        form.reset({
            title: eduAndCertData.title ?? "",
            description:
                eduAndCertData.description ?? "",
            type:
                eduAndCertData.type ??
                educationOrCertification[0] ??
                "",
            startDate: eduAndCertData.startDate
                ? new Date(
                    eduAndCertData.startDate
                )
                : null,
            endDate: eduAndCertData.endDate
                ? new Date(
                    eduAndCertData.endDate
                )
                : null,
            thumbnail,
            link: eduAndCertData.link ?? "",
        });

        setPreviousThumbnail(null);
        setServerError(null);
    }, [
        eduAndCertData,
        isModalOpen,
        form,
    ]);

    const onSubmit = async (
        values: FormValues
    ) => {
        if (!eduAndCertData?._id) {
            setServerError(
                "Education or certification not found."
            );
            return;
        }

        setServerError(null);

        const result = await updateEduCert({
            id: eduAndCertData._id,
            ...values,
        });

        if (!result.success) {
            setServerError(result.error);
            return;
        }

        form.reset();
        setPreviousThumbnail(null);
        onClose();
    };

    const handleOpenChange = (
        open: boolean
    ) => {
        if (!open) {
            form.reset();
            setPreviousThumbnail(null);
            setServerError(null);
            onClose();
        }
    };

    const handleChangeThumbnail = () => {
        thumbnailInputRef.current?.click();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Edit Education or Certifications
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="space-y-4">
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
                                    <FieldLabel htmlFor="title">
                                        Title
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="title"
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
                                            {educationOrCertification.map(
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
                                    <FieldLabel htmlFor="link">
                                        Link
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="link"
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

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                                            Pick start date
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
                                                        field.value ??
                                                        null
                                                    }
                                                    onChange={
                                                        field.onChange
                                                    }
                                                    dateFormat="yyyy/MM/dd"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
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
                                                            Pick end date
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
                                                        field.value ??
                                                        null
                                                    }
                                                    onChange={
                                                        field.onChange
                                                    }
                                                    dateFormat="yyyy/MM/dd"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
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
                                    <FieldLabel>
                                        Thumbnail
                                    </FieldLabel>

                                    <div className="flex items-start gap-4">
                                        {field.value &&
                                            !(
                                                field.value instanceof
                                                File
                                            ) && (
                                                <div>
                                                    <Image
                                                        src={
                                                            field
                                                                .value
                                                                .url
                                                        }
                                                        alt="Current thumbnail"
                                                        width={96}
                                                        height={96}
                                                        className="rounded object-cover"
                                                    />

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-2"
                                                        onClick={
                                                            handleChangeThumbnail
                                                        }
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            )}

                                        {field.value instanceof
                                            File && (
                                                <div>
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            field.value
                                                        )}
                                                        alt="New thumbnail"
                                                        width={96}
                                                        height={96}
                                                        className="rounded object-cover"
                                                    />

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-2"
                                                        onClick={
                                                            handleChangeThumbnail
                                                        }
                                                    >
                                                        Change
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
                                                    event.target
                                                        .files?.[0];

                                                if (!file) {
                                                    return;
                                                }

                                                field.onChange(
                                                    file
                                                );
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

                        {serverError && (
                            <div
                                role="alert"
                                className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                            >
                                {serverError}
                            </div>
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            onClick={() => {
                                form.reset();
                                setPreviousThumbnail(
                                    null
                                );
                                setServerError(null);
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
                                : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}