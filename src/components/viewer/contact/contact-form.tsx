'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createContactRequest } from "@/lib/server-actions/contact.server";
import { contactSchema, type ContactInput } from "@/lib/validations/contact.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ContactForm = () => {

    const [successMessage, setSuccessMessage] = useState(false);
    const [serverError, setServerError] =
        useState<string | null>(null);

    const form = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: '',
            email: '',
            message: ''
        }

    })

    const onSubmit = async (
        values: ContactInput
    ) => {
        setServerError(null);
        setSuccessMessage(false);

        const response =
            await createContactRequest(values);

        if (!response.success) {
            setServerError(response.error);
            return;
        }

        form.reset();
        setSuccessMessage(true);

        window.setTimeout(() => {
            setSuccessMessage(false);
        }, 10000);
    };

    const isSubmitting = form.formState.isSubmitting

    return (
        <>
            {
                successMessage &&
                <div className="text-green-500 px-4 md:text-center mt-8 font-medium text-xs md:-mb-8">
                    🎉 Your message has been sent successfully! I will get back to you soon.
                </div>

            }

            {serverError && (
                <div
                    role="alert"
                    className="mt-8 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 md:mx-auto md:w-6/12"
                >
                    {serverError}
                </div>
            )}

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-8 flex flex-col items-stretch gap-4 p-4 transition-all duration-300 sm:w-8/12 md:mt-16 md:w-6/12"
            >
                <Controller
                    name="fullName"
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
                            <FieldLabel className="fade-up">
                                Full Name
                            </FieldLabel>

                            <Input
                                {...field}
                                placeholder="Your Name"
                                disabled={
                                    isSubmitting
                                }
                                aria-invalid={
                                    fieldState.invalid
                                }
                                className="fade-up border-x-0 border-b-2 border-t-0 bg-transparent px-0 italic focus-visible:ring-0 dark:bg-transparent"
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
                    name="email"
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
                            <FieldLabel className="fade-up">
                                Email
                            </FieldLabel>

                            <Input
                                {...field}
                                type="email"
                                placeholder="johncena@gmail.com"
                                disabled={
                                    isSubmitting
                                }
                                autoComplete="email"
                                aria-invalid={
                                    fieldState.invalid
                                }
                                className="fade-up border-x-0 border-b-2 border-t-0 bg-transparent px-0 italic text-white focus-visible:ring-0 dark:bg-transparent"
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
                    name="message"
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
                            <FieldLabel className="fade-up">
                                Message
                            </FieldLabel>

                            <Textarea
                                {...field}
                                placeholder="Describe your message..."
                                disabled={
                                    isSubmitting
                                }
                                aria-invalid={
                                    fieldState.invalid
                                }
                                className="fade-up resize-none border-x-0 border-b-2 border-t-0 bg-transparent px-0 italic text-white focus-visible:ring-0 dark:bg-transparent"
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

                <div className="flex w-full items-center justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="fade-up relative overflow-hidden rounded-none border border-zinc-400 bg-transparent px-6 py-2 text-xs font-bold tracking-wider text-white hover:bg-transparent hover:text-neutral-950 md:text-sm"
                    >
                        <div className="absolute inset-0 -z-10 -translate-x-full bg-zinc-300 transition-all duration-300 group-hover:translate-x-0" />

                        <span className="z-10 flex items-center gap-2">
                            <SendHorizonal className="h-4 w-4" />

                            {isSubmitting
                                ? "Just a Moment..."
                                : "Let's Connect!"}
                        </span>
                    </Button>
                </div>
            </form>
        </>
    )
}