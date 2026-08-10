"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { useModal } from "@/hooks/use-modal-store";
import { deleteEduCert } from "@/lib/server-actions/edu-cert.server";

export const DeleteEduOrCertModal = () => {
    const {
        onClose,
        isOpen,
        type,
        data,
    } = useModal();

    const { eduAndCertData } = data;

    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const isModalOpen =
        isOpen && type === "deleteEduOrCert";

    const onDelete = () => {
        if (!eduAndCertData?._id) {
            setServerError(
                "Education or certification not found."
            );
            return;
        }

        setServerError(null);

        startTransition(async () => {
            const result = await deleteEduCert({
                id: String(eduAndCertData._id),
            });

            if (!result.success) {
                setServerError(result.error);
                return;
            }

            onClose();
            router.refresh();
        });
    };

    const handleClose = () => {
        if (isPending) return;

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
                        Delete Education or Certification
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {eduAndCertData?.title}
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
                            : `Delete ${eduAndCertData?.title ?? "Entry"}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};