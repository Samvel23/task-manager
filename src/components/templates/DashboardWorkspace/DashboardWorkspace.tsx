"use client";

import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { CommentList } from "@/components/molecules";
import {
  DashboardHeader,
  DashboardTasks,
  ProjectOverview,
} from "@/components/organisms";
import type { IComment, ITodo, IUser } from "@/graphql";
import commonStyles from "@/app/styles/dashboard-common.module.scss";
import styles from "./DashboardWorkspace.module.scss";

interface IDashboardWorkspaceProps {
  users: IUser[];
  currentUser: IUser;
  todos: ITodo[];
  groups: Map<string | null, ITodo[]>;
  comments: IComment[];
  searchQuery: string;
  searchResultsQuery: string;
  taskPage: number;
  taskTotal: number;
  isLoadingTasks: boolean;
  isLoadingMore: boolean;
  isLoadingComments: boolean;
  taskError: string | null;
  commentsError: string | null;
  userLoadError: string | null;
  onLogin: (user: IUser) => void;
  onLogout: () => void;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  onTaskCreated: (todo: ITodo) => void;
  onTodoUpdated: (todo: ITodo) => void;
  onTodoDeleted: (id: string) => void;
  onCommentAdded: (comment: IComment) => void;
}

export const DashboardWorkspace = ({
  users,
  currentUser,
  todos,
  groups,
  comments,
  searchQuery,
  searchResultsQuery,
  taskPage,
  taskTotal,
  isLoadingTasks,
  isLoadingMore,
  isLoadingComments,
  taskError,
  commentsError,
  userLoadError,
  onLogin,
  onLogout,
  onSearchChange,
  onLoadMore,
  onTaskCreated,
  onTodoUpdated,
  onTodoDeleted,
  onCommentAdded,
}: IDashboardWorkspaceProps) => {
  return (
    <main className={`${commonStyles.mainContainer} taskPage`}>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop
        closeOnClick={false}
        closeButton={false}
        draggable={false}
        theme="light"
        className="taskToastContainer"
        toastClassName="taskToast"
      />
      <meta
        name="description"
        content="Organize tasks, projects, and team conversations in TaskFlow."
      />
      {/* Required to scope the page-specific browser color scheme. */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/task-page.css" precedence="page" />
      <DashboardHeader
        users={users}
        currentUser={currentUser}
        onLogin={onLogin}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <div className={styles.dashboardGrid}>
        <div>
          {userLoadError && (
            <p className={commonStyles.workspaceError} role="status">
              User list fallback: {userLoadError}
            </p>
          )}
          <DashboardTasks
            currentUser={currentUser}
            todos={todos}
            searchQuery={searchResultsQuery}
            isLoading={isLoadingTasks}
            isLoadingMore={isLoadingMore}
            error={taskError}
            page={taskPage}
            total={taskTotal}
            onLoadMore={onLoadMore}
            onTaskCreated={onTaskCreated}
            onTodoUpdated={onTodoUpdated}
            onTodoDeleted={onTodoDeleted}
          />
        </div>
        <aside className={styles.commentsSection}>
          <Suspense
            fallback={
              <p className={commonStyles.loadingText}>Loading comments…</p>
            }
          >
            <CommentList
              comments={comments}
              postId={comments[0]?.postId ?? "1"}
              currentUser={currentUser}
              isLoading={isLoadingComments}
              statusMessage={commentsError}
              onCommentsChange={onCommentAdded}
            />
          </Suspense>
        </aside>
      </div>
      <ProjectOverview users={users} groups={groups} />
      <footer className={styles.footer}>
        <span>TaskFlow</span>
        <span>Small steps add up.</span>
      </footer>
    </main>
  );
};
