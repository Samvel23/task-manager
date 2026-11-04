"use client";

import { use, useState } from "react"
;
import Link from "next/link";

import { AuthContext, ThemeContext } from "@/context";

import {
  Breadcrumb,
  CommentList,
  TaskSummary,
  AuthControls,
} from "@/components/molecules";
import { TaskDetailsLayout } from "@/components/templates";
import { TaskAccessGate } from "@/components/organisms/TaskAccessGate/TaskAccessGate";

import type { IComment, ITodo } from "@/graphql/types";

import styles from "./TaskDetails.module.scss";

export const TaskDetails = ({
  todoPromise,
  commentsPromise,
  taskId,
}: {
  todoPromise: Promise<ITodo>;
  commentsPromise: Promise<IComment[]>;
  taskId: string;
}) => {
  const todo = use(todoPromise);
  const auth = use(AuthContext);
  const [commentsOverride, setCommentsOverride] = useState<IComment[] | null>(
    null,
  );
  const currentUser = auth?.currentUser ?? null;
  const theme = currentUser ? use(ThemeContext) : undefined;

  if (!currentUser) {
    return (
      <TaskAccessGate
        title="Sign in to view this task"
        description="Log in as the task owner to open this private workspace."
        users={todo.user ? [todo.user] : []}
        onLogin={(user) => auth?.login(user)}
        onLogout={() => auth?.logout()}
      />
    );
  }

  if (todo.user?.id && todo.user.id !== currentUser.id) {
    return (
      <TaskAccessGate
        title="This task is not in your workspace"
        description="Only the task owner can access its details and comments."
        isDenied
      />
    );
  }

  const comments = use(commentsPromise);
  const visibleComments = commentsOverride ?? comments;

  return (
    <>
      <title>{`${todo.title} | TaskFlow`}</title>
      <meta
        name="description"
        content={`Task details for ${todo.title} in TaskFlow.`}
      />
      <TaskDetailsLayout>
        <header className={styles.detailHeader}>
          <Link className={styles.detailBrand} href="/">
            TaskFlow
          </Link>
          <div className={styles.detailHeaderActions}>
            <AuthControls
              users={[currentUser]}
              currentUser={currentUser}
              onLogin={(user) => auth?.login(user)}
              onLogout={() => auth?.logout()}
            />
            <button
              type="button"
              onClick={theme?.toggleTheme}
              aria-label={`Switch to ${theme?.theme === "dark" ? "light" : "dark"} theme`}
              className={styles.detailThemeButton}
            >
              {theme?.theme === "dark" ? "Light theme" : "Dark theme"}
            </button>
          </div>
        </header>
        <Breadcrumb taskId={taskId} />
        <TaskSummary todo={todo} />
        <CommentList
          comments={visibleComments}
          postId={visibleComments[0]?.postId ?? taskId}
          currentUser={currentUser}
          onCommentsChange={(comment) =>
            setCommentsOverride((previous) => [
              ...(previous ?? visibleComments),
              { ...comment, userId: currentUser.id },
            ])
          }
        />
      </TaskDetailsLayout>
    </>
  );
}
