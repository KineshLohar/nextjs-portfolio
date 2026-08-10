"use client";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/lib/server-actions/auth.server";
import { Button } from "../ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const initialState = {
    success: false,
    error: null,
};

export const LoginForm = () => {
    const router = useRouter();

    const [state, formAction, isPending] =
        useActionState(login, initialState);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        console.log(
            "[LOGIN] state:",
            state.success,
            state.error
        );

        if (!state.success) {
            return;
        }

        console.log("[LOGIN] REDIRECTING TO ADMIN");

        form.reset();
        window.location.replace("/admin/work-experience");
    }, [state.success, state.error, form]);

    const onSubmit = (values: LoginFormValues) => {
        const formData = new FormData();

        formData.append("email", values.email);
        formData.append("password", values.password);

        formAction(formData);
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full"
            noValidate
        >
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-email">
                                Email
                            </FieldLabel>

                            <Input
                                {...field}
                                id="login-email"
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                aria-invalid={fieldState.invalid}
                                disabled={isPending}
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
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-password">
                                Password
                            </FieldLabel>

                            <Input
                                {...field}
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                aria-invalid={fieldState.invalid}
                                disabled={isPending}
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

                {state.error && (
                    <div
                        role="alert"
                        className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    >
                        {state.error}
                    </div>
                )}

                <div className="flex w-full items-center justify-end">
                    <Button
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Logging in..."
                            : "Login"}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
};