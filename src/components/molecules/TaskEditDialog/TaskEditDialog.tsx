"use client";

import { useCallback, useState } from "react";

import { Input, SubmitButton } from "@/components/atoms";

import type { ITodo } from "@/graphql";

import styles from "./TaskEditDialog.module.scss";

interface ITaskEditDialogProps {
  todo: ITodo;
  isOpen: boolean;
  isPending?: boolean;
  onClose: () => void;
  onEdit: (formData: FormData) => Promise<boolean>;
}

export const TaskEditDialog = ({
  todo,
  isOpen,
  isPending,
  onClose,
  onEdit,
}: ITaskEditDialogProps) => {
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const dialogRef = useCallback((dialog: HTMLDialogElement | null) => {
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.editDialog}
      aria-labelledby={`edit-title-${todo.id}`}
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className={styles.editForm}>
        <div className={styles.editHeader}>
          <h2 className={styles.editTitle} id={`edit-title-${todo.id}`}>
            Edit task
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close edit task dialog"
            onClick={onClose}
          >
            <svg
              className={styles.closeIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <form
          action={async (formData) => {
            const saved = await onEdit(formData);
            if (saved) onClose();
          }}
        >
          <input type="hidden" name="id" value={todo.id} />
          <Input
            name="title"
            label="Task title"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            minLength={3}
            required
          />
          <SubmitButton
            label="Save"
            loadingLabel="Saving…"
            disabled={isPending || editedTitle.trim() === todo.title}
          />
        </form>
      </div>
    </dialog>
  );
}
