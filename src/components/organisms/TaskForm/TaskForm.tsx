// src/components/organisms/TaskForm/TaskForm.tsx
"use client";

import { useActionState } from "react";

import { Input, SubmitButton } from "@/components/atoms";

import { fetchGraphQL } from "@/graphql/client";
import { CREATE_TODO_MUTATION } from "@/graphql/queries";
import type { ICreateTodoInput, ITodo, IUser } from "@/graphql/types";

import styles from "./TaskForm.module.scss";

interface ITaskFormProps {
  onTaskCreated?: (newTask: ITodo) => void;
  currentUser: IUser;
}

interface IFormState {
  error: string | null;
  successMessage: string | null;
  todo: ITodo | null;
}

export const TaskForm = ({ onTaskCreated, currentUser }: ITaskFormProps) => {
  const handleCreateTaskAction = async (
    _previousState: IFormState,
    formData: FormData,
  ): Promise<IFormState> => {
    const title = formData.get("title")?.toString().trim();
    if (!title || title.length < 3) {
      return {
        error: "Task title must be at least 3 characters long.",
        successMessage: null,
        todo: null,
      };
    }

    try {
      const data = await fetchGraphQL<
        { createTodo: ITodo },
        { input: ICreateTodoInput }
      >(
        CREATE_TODO_MUTATION,
        {
          input: { title, completed: false },
        },
      );
      const createdTodo = {
        ...data.createTodo,
        user: currentUser,
        userId: currentUser.id,
      };

      if (onTaskCreated) {
        onTaskCreated(createdTodo);
      }

      return {
        error: null,
        successMessage: `Created "${createdTodo.title}".`,
        todo: createdTodo,
      };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Failed to create task",
        successMessage: null,
        todo: null,
      };
    }
  };

  const [state, formAction] = useActionState(handleCreateTaskAction, {
    error: null,
    successMessage: null,
    todo: null,
  });

  return (
    <form action={formAction} className={styles.taskFormContainer}>
      <div className={styles.taskFormHeader}>
        <div>
          <h2 className={styles.taskFormTitle}>Add new task</h2>
        </div>
        <span className={styles.taskFormOwner}>
          <span className={styles.ownerAvatar} aria-hidden="true">
            {currentUser.name.slice(0, 1).toUpperCase()}
          </span>
          <span className={styles.ownerInfo}>
            <span className={styles.ownerLabel}>Assigned to</span>
            <span className={styles.ownerName}>{currentUser.name}</span>
          </span>
        </span>
      </div>

      <Input
        name="title"
        label="Task title"
        placeholder="Write a clear task title"
        minLength={3}
        required
      />

      {state.error && (
        <p className={styles.taskFormError} role="alert">
          {state.error}
        </p>
      )}
      {state.successMessage && (
        <p className={styles.taskFormSuccess} role="status">
          {state.successMessage}
        </p>
      )}

      <SubmitButton label="Create Task" loadingLabel="Creating…" />
    </form>
  );
}
