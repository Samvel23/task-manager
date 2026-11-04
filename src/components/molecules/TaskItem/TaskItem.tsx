// src/components/molecules/TaskItem/TaskItem.tsx
"use client";

import { useState } from "react";

import Link from "next/link";

import type { ITodo } from "@/graphql/types";

import styles from "./TaskItem.module.scss";
import { TaskEditDialog } from "@/components/molecules/TaskEditDialog/TaskEditDialog";

interface ITaskItemProps {
  todo: ITodo;
  isPending?: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (formData: FormData) => Promise<boolean>;
}

export const TaskItem = ({
  todo,
  isPending,
  onToggle,
  onEdit,
}: ITaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div
      className={`${styles.taskItemCard} ${isPending ? styles.pending : ""}`}
    >
      <div className={styles.taskItemLeft}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={todo.completed}
            disabled={isPending}
            aria-label={`Mark ${todo.title} ${todo.completed ? "incomplete" : "complete"}`}
            onChange={(e) => onToggle(todo.id, e.target.checked)}
            className={styles.taskCheckbox}
          />
          {isPending && <span className={styles.itemSpinner} />}
        </div>
        <Link
          href={`/tasks/${encodeURIComponent(todo.id)}`}
          className={`${styles.taskTitle} ${todo.completed ? styles.taskCompleted : ""}`}
        >
          {todo.title}
        </Link>
      </div>
      <div className={styles.taskItemActions}>
        {todo.user && (
          <span className={styles.taskUserBadge}>{todo.user.name}</span>
        )}
        <button
          type="button"
          className={styles.editSummary}
          aria-haspopup="dialog"
          onClick={() => setIsEditOpen(true)}
        >
          Edit
        </button>
        <TaskEditDialog
          todo={todo}
          isOpen={isEditOpen}
          isPending={isPending}
          onClose={() => setIsEditOpen(false)}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}
