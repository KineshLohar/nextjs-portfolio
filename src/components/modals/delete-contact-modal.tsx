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
import { deleteContactRequest } from "@/lib/server-actions/contact.server";

export const DeleteContactModal = () => {
    const {
        onClose,
        isOpen,
        type,
        data,
    } = useModal();

    const contactData = data.contactData;

    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const isModalOpen =
        isOpen && type === "deleteContact";

    const onDelete = () => {
        if (!contactData?._id) {
            setServerError(
                "Contact request not found."
            );

            return;
        }

        setServerError(null);

        startTransition(async () => {
            const response =
                await deleteContactRequest(
                    String(contactData._id)
                );

            if (!response.success) {
                setServerError(response.error);
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
                        Delete Contact
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="space-y-2">
                    <p>
                        Are you sure you want to delete{" "}
                        <span className="font-bold">
                            {contactData?.email}
                        </span>
                        ?
                    </p>

                    <p>
                        This action cannot be undone.
                    </p>

                    <p>
                        <span className="font-semibold">
                            Message:
                        </span>{" "}
                        {contactData?.message}
                    </p>
                </DialogDescription>

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
                            : `Delete ${contactData?.fullName ?? ""}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};