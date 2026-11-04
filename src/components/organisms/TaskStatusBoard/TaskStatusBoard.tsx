"use client";

import { Activity, useState, type KeyboardEvent } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TaskList } from "@/components/organisms/TaskList/TaskList";

import type { ITodo } from "@/graphql";

import { TASK_PAGE_SIZE } from "@/lib/dashboard-data";

import styles from "./TaskStatusBoard.module.scss";
import commonStyles from "@/app/styles/dashboard-common.module.scss";

interface ITaskStatusBoardProps {
  todos: ITodo[];
  userId: string;
  searchQuery: string;
  page: number;
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onTodoUpdated: (todo: ITodo) => void;
  onTodoDeleted: (id: string) => void;
}

export const TaskStatusBoard = ({
  todos,
  userId,
  searchQuery,
  page,
  total,
  isLoading,
  isLoadingMore,
  onLoadMore,
  onTodoUpdated,
  onTodoDeleted,
}: ITaskStatusBoardProps) => {
  const [activeTab, setActiveTab] = useState<"open" | "completed">("open");
  const openCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const listProps = {
    initialTodos: todos,
    searchQuery,
    selectedUserId: userId,
    hasMore: page * TASK_PAGE_SIZE < total,
    isLoadingMore,
    onLoadMore,
    onTodoUpdated,
    onTodoDeleted,
    onTodoStatusChanged: (completed: boolean) =>
      setActiveTab(completed ? "completed" : "open"),
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    event.preventDefault();
    const nextTab =
      event.key === "Home" || event.key === "ArrowLeft" ? "open" : "completed";
    setActiveTab(nextTab);
    document.getElementById(`${nextTab}-tasks-tab`)?.focus();
  };

  return (
    <>
      <div className={styles.taskTabs} role="tablist" aria-label="Task status">
        <button
          type="button"
          role="tab"
          id="open-tasks-tab"
          aria-selected={activeTab === "open"}
          aria-controls="open-tasks-panel"
          tabIndex={activeTab === "open" ? 0 : -1}
          className={activeTab === "open" ? styles.activeTaskTab : ""}
          onClick={() => setActiveTab("open")}
          onKeyDown={handleKeyDown}
        >
          Open<span>{openCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="completed-tasks-tab"
          aria-selected={activeTab === "completed"}
          aria-controls="completed-tasks-panel"
          tabIndex={activeTab === "completed" ? 0 : -1}
          className={activeTab === "completed" ? styles.activeTaskTab : ""}
          onClick={() => setActiveTab("completed")}
          onKeyDown={handleKeyDown}
        >
          Completed<span>{completedCount}</span>
        </button>
      </div>
      {isLoading && todos.length === 0 && (
        <p className={commonStyles.loadingText}>Loading your tasks…</p>
      )}
      <ErrorBoundary>
        <div
          id="open-tasks-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="open-tasks-tab"
          hidden={activeTab !== "open"}
        >
          <Activity mode={activeTab === "open" ? "visible" : "hidden"}>
            <TaskList {...listProps} taskStatus="open" title="Open tasks" />
          </Activity>
        </div>
        <div
          id="completed-tasks-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="completed-tasks-tab"
          hidden={activeTab !== "completed"}
        >
          <Activity mode={activeTab === "completed" ? "visible" : "hidden"}>
            <TaskList
              {...listProps}
              taskStatus="completed"
              title="Completed tasks"
            />
          </Activity>
        </div>
      </ErrorBoundary>
    </>
  );
};
