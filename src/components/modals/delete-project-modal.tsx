"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { deleteProject } from "@/lib/server-actions/project.server";

export const DeleteProjectModal = () => {
    const {
        onClose,
        isOpen,
        type,
        data,
    } = useModal();

    const { projectData } = data;

    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const isModalOpen =
        isOpen && type === "deleteProject";

    const onDelete = () => {
        if (!projectData?._id) {
            setServerError("Project not found.");
            return;
        }

        setServerError(null);

        startTransition(async () => {
            const result = await deleteProject({
                id: String(projectData._id),
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
                        Delete Project
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {projectData?.title}
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
                            : `Delete ${projectData?.title ?? "Project"}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};