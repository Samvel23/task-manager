"use client";

import type { ITodo, IUser } from "@/graphql";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TaskForm } from "@/components/organisms/TaskForm/TaskForm";
import { TaskStatusBoard } from "@/components/organisms/TaskStatusBoard/TaskStatusBoard";

import styles from "./DashboardTasks.module.scss";
import commonStyles from "@/app/styles/dashboard-common.module.scss";

interface IDashboardTasksProps {
  currentUser: IUser;
  todos: ITodo[];
  searchQuery: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  total: number;
  onLoadMore: () => void;
  onTaskCreated: (todo: ITodo) => void;
  onTodoUpdated: (todo: ITodo) => void;
  onTodoDeleted: (id: string) => void;
}

export const DashboardTasks =  ({
  currentUser,
  todos,
  searchQuery,
  isLoading,
  isLoadingMore,
  error,
  page,
  total,
  onLoadMore,
  onTaskCreated,
  onTodoUpdated,
  onTodoDeleted,
}: IDashboardTasksProps) => {
  return (
    <section className={styles.tasksSection}>
      <div className={styles.sectionIntro}>
        <div>
          <p className={commonStyles.eyebrow}>YOUR WORKSPACE</p>
          <h2 className={styles.sectionTitle}>
            {`Welcome back, ${currentUser.name.split(" ")[0]}.`}
          </h2>
        </div>
        <span className={styles.taskCount}>
          {todos.filter((todo) => !todo.completed).length} open
        </span>
      </div>
      <ErrorBoundary>
        <TaskForm onTaskCreated={onTaskCreated} currentUser={currentUser} />
      </ErrorBoundary>
      {error && (
        <p className={commonStyles.workspaceError} role="alert">
          {error}
        </p>
      )}
      {isLoading && todos.length > 0 && (
        <p className={commonStyles.loadingText} role="status">
          Updating task results…
        </p>
      )}
      <TaskStatusBoard
        todos={todos}
        userId={currentUser.id}
        searchQuery={searchQuery}
        page={page}
        total={total}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
        onTodoUpdated={onTodoUpdated}
        onTodoDeleted={onTodoDeleted}
      />
    </section>
  );
}
