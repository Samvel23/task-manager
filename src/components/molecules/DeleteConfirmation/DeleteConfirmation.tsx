"use client";

import type { ITodo } from "@/graphql";

import { SubmitButton } from "@/components/atoms";

import type { ToastContentProps } from "react-toastify";

import styles from "./DeleteConfirmation.module.scss";

interface IDeleteConfirmationProps {
  todo: ITodo;
  closeToast: ToastContentProps["closeToast"];
  onConfirm: (formData: FormData) => Promise<boolean>;
}

export const DeleteConfirmation = ({
  todo,
  closeToast,
  onConfirm,
}: IDeleteConfirmationProps) => {
  return (
    <div
      className={styles.confirmation}
      role="alertdialog"
      aria-labelledby={`delete-confirmation-title-${todo.id}`}
      aria-describedby={`delete-confirmation-description-${todo.id}`}
    >
      <div>
        <h3
          className={styles.title}
          id={`delete-confirmation-title-${todo.id}`}
        >
          Delete this task?
        </h3>
        <p
          className={styles.description}
          id={`delete-confirmation-description-${todo.id}`}
        >
          <strong>{todo.title}</strong> will be permanently removed.
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => closeToast()}
        >
          Cancel
        </button>
        <form
          action={async (formData) => {
            if (await onConfirm(formData)) closeToast();
          }}
        >
          <input type="hidden" name="id" value={todo.id} />
          <input type="hidden" name="title" value={todo.title} />
          <SubmitButton
            label="Delete"
            loadingLabel="Deleting…"
            variant="danger"
          />
        </form>
      </div>
    </div>
  );
}
