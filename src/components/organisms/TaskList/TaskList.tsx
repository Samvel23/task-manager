// src/components/organisms/TaskList/TaskList.tsx
"use client";

import { useMemo } from "react";

import type { ITodo } from "@/graphql";

import { DeleteConfirmation, TaskItem } from "@/components/molecules";

import { useTaskListActions } from "@/hooks/useTaskListActions";

import { toast } from "react-toastify";

import styles from "./TaskList.module.scss";

interface ITaskListProps {
  initialTodos: ITodo[];
  searchQuery?: string;
  selectedUserId: string | null;
  taskStatus: "open" | "completed";
  hasMore: boolean;
  isLoadingMore: boolean;
  title: string;
  onLoadMore: () => void;
  onTodoUpdated: (todo: ITodo) => void;
  onTodoDeleted: (id: string) => void;
  onTodoStatusChanged: (completed: boolean) => void;
}

export const TaskList = ({
  initialTodos,
  searchQuery,
  selectedUserId,
  taskStatus,
  hasMore,
  isLoadingMore,
  title,
  onLoadMore,
  onTodoUpdated,
  onTodoDeleted,
  onTodoStatusChanged,
}: ITaskListProps) => {
  const normalizedSearch = searchQuery?.toLowerCase() ?? "";
  const {
    todos: optimisticTodos,
    pendingId,
    isPending,
    errorMessage,
    handleToggle,
    handleEdit,
    handleDelete,
  } = useTaskListActions(
    initialTodos,
    onTodoUpdated,
    onTodoDeleted,
    onTodoStatusChanged,
  );

  const filteredTodos = useMemo(
    () =>
      optimisticTodos.filter(
        (todo) =>
          (!selectedUserId || todo.userId === selectedUserId) &&
          todo.completed === (taskStatus === "completed") &&
          (!normalizedSearch ||
            todo.title.toLowerCase().includes(normalizedSearch)),
      ),
    [normalizedSearch, optimisticTodos, selectedUserId, taskStatus],
  );

  const displayedTodos = filteredTodos;

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.header}>
        <h2 className={styles.taskListTitle}>{title}</h2>
        <span className={styles.taskCount}>
          {displayedTodos.length} of {filteredTodos.length} shown
        </span>
      </div>

      {errorMessage && (
        <p className={styles.taskListError} role="alert">
          {errorMessage}
        </p>
      )}

      <div className={styles.taskItemsWrapper}>
        {displayedTodos.map((todo) => (
          <div key={todo.id} className={styles.taskItemWrapper}>
            <TaskItem
              todo={todo}
              isPending={pendingId === todo.id}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
            <div className={styles.deleteForm}>
              <button
                type="button"
                className={styles.deleteTrigger}
                disabled={isPending || pendingId !== null}
                onClick={() => {
                  toast(
                    ({ closeToast }) => (
                      <DeleteConfirmation
                        todo={todo}
                        closeToast={closeToast}
                        onConfirm={handleDelete}
                      />
                    ),
                    {
                      autoClose: false,
                      closeOnClick: false,
                      closeButton: false,
                      draggable: false,
                      toastId: `confirm-delete-${todo.id}`,
                      role: "presentation",
                    },
                  );
                }}
                aria-label={`Delete task: ${todo.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <p className={styles.emptyState}>
          No tasks match your current filters.
        </p>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isPending || isLoadingMore}
          className={styles.loadMoreButton}
        >
          {isLoadingMore ? "Loading…" : "Load more tasks"}
        </button>
      )}
    </div>
  );
};
