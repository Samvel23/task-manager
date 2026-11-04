"use client";

import { use, useMemo, useState, Suspense, useDeferredValue } from "react";

import { io } from "next/cache";

import { AuthContext } from "@/context";

import { LoginGate } from "@/components/organisms";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardWorkspace } from "@/components/templates";

import { useDashboardTasks } from "@/hooks/useDashboardTasks";
import { useDashboardComments } from "@/hooks/useDashboardComments";

import { fetchDashboardData, type IDashboardData } from "@/lib/dashboard-data";

import { FALLBACK_USERS, type ITodo, type IUser } from "@/graphql";

import styles from "@/app/styles/dashboard-common.module.scss";

const TaskDashboard = ({
  dashboardPromise,
}: {
  dashboardPromise: Promise<IDashboardData>;
}) => {
  const { users, loadError } = use(dashboardPromise);
  const auth = use(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery, "");

  const currentUser = auth?.currentUser
    ? (users.find((user) => user.id === auth.currentUser?.id) ?? null)
    : null;
  const currentUserId = currentUser?.id ?? null;
  const tasks = useDashboardTasks(currentUserId, deferredSearchQuery);
  const comments = useDashboardComments(currentUserId);
  const groups = useMemo(() => {
    const result = new Map<string | null, ITodo[]>();
    for (const todo of tasks.todos) {
      const ownerId = todo.userId ?? null;
      const group = result.get(ownerId) ?? [];
      group.push(todo);
      result.set(ownerId, group);
    }
    return result;
  }, [tasks.todos]);

  const resetWorkspace = () => {
    tasks.reset();
    comments.reset();
  };

  const handleLogin = (user: IUser) => {
    resetWorkspace();
    auth?.login(user);
  };

  const handleLogout = () => {
    resetWorkspace();
    auth?.logout();
  };

  if (!currentUser) {
    return (
      <LoginGate
        users={users}
        onLogin={handleLogin}
        onLogout={handleLogout}
        statusMessage={loadError}
      />
    );
  }

  return (
    <DashboardWorkspace
      users={users}
      currentUser={currentUser}
      todos={tasks.todos}
      groups={groups}
      comments={comments.comments}
      searchQuery={searchQuery}
      searchResultsQuery={deferredSearchQuery}
      taskPage={tasks.page}
      taskTotal={tasks.total}
      isLoadingTasks={tasks.isLoading}
      isLoadingMore={tasks.isLoadingMore}
      isLoadingComments={comments.isLoading}
      taskError={tasks.error}
      commentsError={comments.error}
      userLoadError={loadError}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onSearchChange={setSearchQuery}
      onLoadMore={tasks.loadMore}
      onTaskCreated={tasks.add}
      onTodoUpdated={tasks.update}
      onTodoDeleted={tasks.remove}
      onCommentAdded={comments.append}
    />
  );
}

const DashboardFallback = () => {
  const auth = use(AuthContext);
  if (auth?.currentUser) {
    return <p className={styles.loadingText}>Loading workspace…</p>;
  }

  return (
    <LoginGate
      users={FALLBACK_USERS}
      onLogin={(user) => auth?.login(user)}
      onLogout={() => auth?.logout()}
    />
  );
}

export const TaskDashboardPage = () => {
  use(io());
  const dashboardPromise = useMemo(() => fetchDashboardData(), []);

  return (
    <Suspense fallback={<DashboardFallback />}>
      <ErrorBoundary>
        <TaskDashboard dashboardPromise={dashboardPromise} />
      </ErrorBoundary>
    </Suspense>
  );
}
