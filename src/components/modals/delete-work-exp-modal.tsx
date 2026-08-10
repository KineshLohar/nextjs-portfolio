"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";
import { deleteWorkExperience } from "@/lib/server-actions/work.server";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const DeleteWorkExperienceModal = () => {
    const {
        onClose,
        isOpen,
        type,
        data,
    } = useModal();

    const router = useRouter();

    const { workExperienceData } = data;

    const [serverError, setServerError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const isModalOpen =
        isOpen && type === "deleteWorkExp";

    const onDelete = () => {
        if (!workExperienceData?._id) {
            setServerError(
                "Work experience not found."
            );
            return;
        }

        setServerError(null);

        startTransition(async () => {
            const result =
                await deleteWorkExperience(
                    String(workExperienceData._id)
                );

            if (!result.success) {
                setServerError(result.error);
                return;
            }

            onClose();
            router.refresh();
        });
    };

    const handleClose = () => {
        if (isPending) {
            return;
        }

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Delete Work Experience
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {workExperienceData?.role},{" "}
                        {workExperienceData?.company},{" "}
                        {workExperienceData?.location}
                    </span>
                    ?

                    <br />

                    This action cannot be undone.
                </DialogDescription>

                {serverError && (
                    <div
                        role="alert"
                        className="mt-2 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    >
                        {serverError}
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isPending}
                        onClick={onDelete}
                    >
                        {isPending
                            ? "Deleting..."
                            : `Delete ${workExperienceData?.role ?? "Experience"}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};