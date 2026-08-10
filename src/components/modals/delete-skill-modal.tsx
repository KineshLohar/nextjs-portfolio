"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";
import { deleteSkill } from "@/lib/server-actions/skill.server";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const DeleteSkillModal = () => {
    const {
        onClose,
        isOpen,
        type,
        data,
    } = useModal();

    const skillData = data.skillData;

    const router = useRouter();

    const [serverError, setServerError] =
        useState<string | null>(null);

    const [isPending, startTransition] =
        useTransition();

    const isModalOpen =
        isOpen && type === "deleteSkill";

    const onDelete = () => {
        if (!skillData?._id) {
            setServerError("Skill not found.");
            return;
        }

        setServerError(null);

        startTransition(async () => {
            const result = await deleteSkill(
                String(skillData._id)
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
                        Delete Skill
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Are you sure you want to delete{" "}
                    <span className="font-bold">
                        {skillData?.skill}
                    </span>
                    ?

                    <br />

                    This action cannot be undone.
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
                            : `Delete ${skillData?.skill ?? "Skill"}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};